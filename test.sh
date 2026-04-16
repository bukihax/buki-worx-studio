#!/bin/bash

# Automated cURL tests for AI classification feature in buki-worx-studio

# Base URL for the classification API
BASE_URL="http://localhost:5000/classify"

# Function to test basic classification
function test_basic_classification() {
    echo "Testing basic classification..."
    response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"input": "test input"}' $BASE_URL)
    echo "Response: $response"
}

# Function to test cache hits
function test_cache_hits() {
    echo "Testing cache hits..."
    # First request to store in cache
    curl -s -X POST -H "Content-Type: application/json" -d '{"input": "cached input"}' $BASE_URL
    # Second request to check cache
    response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"input": "cached input"}' $BASE_URL)
    echo "Cache hit response: $response"
}

# Function to test different inputs
function test_different_inputs() {
    echo "Testing different inputs..."
    inputs=("input1" "input2" "input3")
    for input in "${inputs[@]}"; do
        response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"input": "$input"}' $BASE_URL)
        echo "Response for $input: $response"
    done
}

# Function to check cache statistics
function test_cache_statistics() {
    echo "Testing cache statistics..."
    response=$(curl -s -X GET "$BASE_URL/cache/stats")
    echo "Cache statistics: $response"
}

# Function to test error handling
function test_error_handling() {
    echo "Testing error handling..."
    response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"input": ""}' $BASE_URL)
    echo "Error handling response: $response"
}

# Function to check performance timing
function test_performance_timing() {
    echo "Testing performance timing..."
    start_time=$(date +%s%N)
    curl -s -X POST -H "Content-Type: application/json" -d '{"input": "performance test"}' $BASE_URL
    end_time=$(date +%s%N)
    duration=$((end_time - start_time))
    echo "Performance timing: ${duration} nanoseconds"
}

# Execute tests

# Test basic classification
 test_basic_classification

# Test cache hits
 test_cache_hits

# Test different inputs
 test_different_inputs

# Test cache statistics
 test_cache_statistics

# Test error handling
 test_error_handling

# Test performance timing
 test_performance_timing