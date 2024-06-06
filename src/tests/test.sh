#!/bin/bash

# Variables (replace with actual values)
API_URL="http://localhost:3000/api/evaluation"
VALID_TOKEN="eyJhbGciOiJSUzI1NiIsImtpZCI6IjMzMDUxMThiZTBmNTZkYzA4NGE0NmExN2RiNzU1NjVkNzY4YmE2ZmUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdGVzdGluZy1ncm91bmQtNmVkZmQiLCJhdWQiOiJ0ZXN0aW5nLWdyb3VuZC02ZWRmZCIsImF1dGhfdGltZSI6MTcxNzU5MTE3NCwidXNlcl9pZCI6InhGWG5ta1pYWE5Xc0ZPeGtqZEJTeGNzZkJyRDMiLCJzdWIiOiJ4RlhubWtaWFhOV3NGT3hramRCU3hjc2ZCckQzIiwiaWF0IjoxNzE3NTkxMTc0LCJleHAiOjE3MTc1OTQ3NzQsImVtYWlsIjoibm9yZGljQG5kLm5kIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbIm5vcmRpY0BuZC5uZCJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.QE8wMG3Sicm0Fe204mtE3e9ZkY6GPf733vWnuLFWmmRoBdcK1V_Y-35gh3fvXeva7SfvF-ZBzypA_SLlExH-De6gactHAkw3F1ygzsYgTt0vwrLpgEVHJgI2bS4V3EQTtpqI7S_WuAAl0z36XSufnnx4Imt2UcZjqbxfTMCEIhZ09XsN4D3ImW2Ihd0je0IJK1A4t8IegdG4xixQjCKbaeXXF3JPUDHE0FFWGWvYBMajiCbbVm3R8tiBm7Ml-oyZkTT-PLAHZDa-7y5fti33MphADN8FrWDo9Vm8EZ8DItq_Xe87KuIqcJfvaC70fjB4LfryNsTgSCcYZe2gQEUjMw"
INVALID_TOKEN="your-invalid-token"

# Define color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No color

# Counters for total, passed and failed tests
total=0
successful=0
failed=0

# Function for testing user IDs
userIdTests() {
  # Predefined evaluation name for the user ID tests
  EVAL_NAME="Test Evaluation"

  # Array of test case user IDs
  userIds=(
    "1" 
    "8" 
    "0" 
    "9" 
    "nonDigitString" 
    ""
    "-1"
    "null"
  )

  echo "Starting User ID Tests..."

  # Loop over userIds array
  for USER_ID in "${userIds[@]}"
  do
    # Increment total
    ((total++))

    # Send POST request via cURL and store response code and body
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $VALID_TOKEN" \
    -d '{
      "userId": "'"$USER_ID"'",
      "evalName": "'"${EVAL_NAME//\"/\\\"}"'"
    }')

    # If HTTP status code equals 200 or 201, it's a success
    # Modify this condition if your API returns a different status code for success
    if [[ "$RESPONSE" = "200" ]] || [[ "$RESPONSE" = "201" ]]; then
        echo -e "${GREEN}Test #$total PASS: userId='$USER_ID', evalName='$EVAL_NAME'${NC}"
        # Increment successful
        ((successful++))
    else
        echo -e "${RED}Test #$total FAIL: userId='$USER_ID', evalName='$EVAL_NAME', response code='$RESPONSE'${NC}"
        # Increment failed
        ((failed++))
    fi
  done
}

# Function for testing evaluation names
evalNameTests() {
  # Predefined user ID for the evaluation name tests
  USER_ID="1"

  # Generate a 1,000,000 character long evaluation name
  LONG_EVAL_NAME=$(printf 'a%.0s' {1..1000000})

  # Array of test case evaluation names
  evalNames=(
    "Normal Evaluation" # Normal case, this should pass.
    "Normal Evaluation" # Duplicate of the above case, validating how the API handles duplicates.
    "" # Edge case: An empty string, checking the behavior when no evaluation name is provided.
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" # Edge case: Very long evaluation
    # Edge case: Validation with relatively long evaluation name, but under the limit.
    "Test with special characters !@#$%^&*()" # Edge case: Checking how API handles special characters.
    "evaluationWithNoSpaces" # Normal case: Checking a case with no spaces in between.
    "   " # Edge case: Validation with only spaces.
    "evaluation with\nnewline" # Edge case: Checking how the API handles newline characters.
    "   LeadingAndTrailingSpaces   " # Edge case: Validating how the API deals with leading and trailing spaces.
    "$LONG_EVAL_NAME" # Edge case: Check how system handles the evaluation names at maximum length.
    "Áccèntëd téxt" # Edge case: Evaluation name with accent marks, testing unicode character handling.
    "テスト" # Edge case: Non-English characters (Japanese in this case), verifying international language support.
    "тест" # Edge case: Non-English characters (Cyrillic in this case), another check on international characters.
    "اختبار" # Edge case: Non-English characters (Arabic script), another check on international language support.
    "'\"\\" # Edge case: Contains IDL (Interface Definition Language) escape characters, HTML codes, URL encoding respectively. This is a security test case for stored XSS attacks.
    "' OR '1'='1'; --" # Edge case: SQL Injection attack scenario.
    "😀 😃 😄 😁 😆 😅 😂" # Edge case: Check how API handles emojis.
    "💩 Pile of Poo" # Edge case: Test for another emoji, a single emoji character but represented in more than one byte.
    `<evalname>` # Edge case: Evaluation name enclosed in HTML tags.
    "test@example.com" # Edge case: Evaluation name that looks like an email id.
    "**   " # Edge case: Contains trailing spaces.
    "   **" # Edge case: Contains leading spaces.
  )

  echo "Starting Evaluation Name Tests..."

  # Loop over evalNames array
  for EVAL_NAME in "${evalNames[@]}"
  do
    PRINT_NAME=$EVAL_NAME
    if [ "$EVAL_NAME" = "$LONG_EVAL_NAME" ]
    then
        PRINT_NAME="Evaluation name with 1,000,000 characters"
    fi

    # Increment total
    ((total++))

    # Send POST request via cURL and store response code and body
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $VALID_TOKEN" \
    -d '{
      "userId": "'"$USER_ID"'",
      "evalName": "'"${EVAL_NAME//\"/\\\"}"'"
    }')

    # If HTTP status code equals 200 or 201, it's a success
    # Modify this condition if your API returns a different status code for success
    if [[ "$RESPONSE" = "200" ]] || [[ "$RESPONSE" = "201" ]]; then
        echo -e "${GREEN}Test #$total PASS: userId='$USER_ID', evalName='$PRINT_NAME'${NC}"
        # Increment successful
        ((successful++))
    else
        echo -e "${RED}Test #$total FAIL: userId='$USER_ID', evalName='$PRINT_NAME', response code='$RESPONSE'${NC}"
        # Increment failed
        ((failed++))
    fi
  done
}

# Separate function for Authentication testing
authTests() {
  echo "Starting Authorization Tests..."

  echo -e "${GREEN}Starting Authorization Tests...${NC}"

    # Testing with no provided token
    echo "No token provided:"
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL")
    echo "Response status code: $RESPONSE"
    ((TOTAL_TESTS++))
    if [[ "$RESPONSE" == "401" ]]; then ((PASSED_TESTS++)); fi

    # Testing with an invalid token
    echo "Invalid token provided:"
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X GET -H "Authorization: Bearer $INVALID_TOKEN" "$API_URL")
    echo "Response status code: $RESPONSE"
    ((TOTAL_TESTS++))
    if [[ "$RESPONSE" == "401" ]]; then ((PASSED_TESTS++)); fi

    # Testing with a valid token
    echo "Valid token provided:"
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X GET -H "Authorization: Bearer $VALID_TOKEN" "$API_URL")
    echo "Response status code: $RESPONSE"
    ((TOTAL_TESTS++))
    # Assuming that 200 status code means success
    if [[ "$RESPONSE" == "200" ]]; then ((PASSED_TESTS++)); fi

    echo -e "${GREEN}Authorization tests completed.${NC}"
}

# Running Tests
userIdTests
echo
evalNameTests
echo
authTests


# Displaying Results
echo "-------------------------------"
echo -e "Run: ${total}"
echo -e "${GREEN}Pass: ${successful}${NC}"
echo -e "${RED}Fail: ${failed}${NC}"
echo "-------------------------------"