package com.example.backendhoatuoiuit.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.LinkedHashMap;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URLEncoder;
import java.text.Normalizer;
import java.util.regex.Pattern;

@Service
public class MomoService {

    @Value("${accessKey}")
    private String accessKey;
    @Value("${secretKey}")
    private String secretKey;

    private final String partnerCode = "MOMO";
    private final String baseRedirectUrl = "https://hoatuoiuit.id.vn/order-confirmation?orderId=";
    private final String localRedirectUrl = "http://localhost:3000/order-confirmation?orderId=";
    private final String ipnUrl = "https://hoatuoiuit.id.vn/api/payment/momo/ipn";
    private final String requestType = "payWithMethod";
    private final String orderInfo = "Thanh toán đơn hàng";

    @Autowired
    private RestTemplate restTemplate;

    public Map<String, Object> createPayment(Map<String, Object> input) throws Exception {
        // Log input data for debugging
        System.out.println("Input data: " + new ObjectMapper().writeValueAsString(input));

        // Validate required fields
        if (input == null) {
            throw new IllegalArgumentException("Input data cannot be null");
        }

        // Get real orderId for redirect
        String realOrderId = getStringValue(input, "order_id");
        if (realOrderId == null) {
            throw new IllegalArgumentException("order_id is required");
        }
        
        // Generate MoMo orderId using partnerCode + timestamp
        String momoOrderId = partnerCode + System.currentTimeMillis();
        String requestId = momoOrderId;

        // Determine redirect URL based on environment
        String redirectUrl = System.getenv("SPRING_PROFILES_ACTIVE") != null && 
                           System.getenv("SPRING_PROFILES_ACTIVE").equals("prod") 
                           ? baseRedirectUrl + realOrderId 
                           : localRedirectUrl + realOrderId;

        // Create extraData map with correct structure using LinkedHashMap to maintain order
        Map<String, Object> extraData = new LinkedHashMap<>();
        
        // Get order details and convert to correct format
        Object orderDetailsObj = input.get("order_details");
        if (orderDetailsObj == null) {
            throw new IllegalArgumentException("order_details is required");
        }

        // Log order details for debugging
        System.out.println("Order details object: " + orderDetailsObj);
        System.out.println("Order details class: " + orderDetailsObj.getClass().getName());

        List<Map<String, Object>> orderDetails;
        try {
            orderDetails = (List<Map<String, Object>>) orderDetailsObj;
        } catch (ClassCastException e) {
            throw new IllegalArgumentException("order_details must be a list of objects");
        }

        if (orderDetails.isEmpty()) {
            throw new IllegalArgumentException("order_details cannot be empty");
        }

        List<Map<String, Object>> items = orderDetails.stream()
            .map(detail -> {
                if (detail == null) {
                    throw new IllegalArgumentException("Order detail cannot be null");
                }

                // Log each detail for debugging
                System.out.println("Processing detail: " + detail);

                Map<String, Object> item = new HashMap<>();
                
                // Handle productId - ensure it's converted to String
                Object productIdObj = detail.get("product_id");
                System.out.println("ProductId object: " + productIdObj);
                System.out.println("ProductId class: " + (productIdObj != null ? productIdObj.getClass().getName() : "null"));

                if (productIdObj == null) {
                    throw new IllegalArgumentException("product_id is required in order detail");
                }
                String productId = String.valueOf(productIdObj);
                System.out.println("Converted productId: " + productId);
                item.put("product_id", productId);
                
                // Handle quantity
                Object quantity = detail.get("order_detail_quantity");
                if (quantity == null) {
                    throw new IllegalArgumentException("order_detail_quantity is required in order detail");
                }
                item.put("order_detail_quantity", quantity);
                return item;
            })
            .toList();
        
        // Log items for debugging
        System.out.println("Processed items: " + new ObjectMapper().writeValueAsString(items));
        
        // Add items first to match the correct order
        extraData.put("items", items);

        // Get and validate other required fields
        String customerId = getStringValue(input, "customer_id");
        if (customerId == null) {
            throw new IllegalArgumentException("customer_id is required");
        }
        extraData.put("userId", Integer.parseInt(customerId));

        String name = getStringValue(input, "order_name");
        if (name == null) {
            throw new IllegalArgumentException("order_name is required");
        }
        extraData.put("name", name);

        String phone = getStringValue(input, "order_phone");
        if (phone == null) {
            throw new IllegalArgumentException("order_phone is required");
        }
        extraData.put("phone", phone);

        String address = getStringValue(input, "order_delivery_address");
        if (address == null) {
            throw new IllegalArgumentException("order_delivery_address is required");
        }
        extraData.put("address", address);

        Object amount = input.get("order_total");
        if (amount == null) {
            throw new IllegalArgumentException("order_total is required");
        }
        extraData.put("amount", amount);

        // Convert extraData to JSON string and encode
        ObjectMapper objectMapper = new ObjectMapper();
        String extraDataJson = objectMapper.writeValueAsString(extraData);
        String encodedExtraData = URLEncoder.encode(extraDataJson, StandardCharsets.UTF_8.toString());

        // Log extraData for debugging
        System.out.println("ExtraData JSON: " + extraDataJson);
        System.out.println("Encoded ExtraData: " + encodedExtraData);

        // Create raw signature string with real orderId in redirectUrl but momoOrderId for transaction
        String rawSignature = String.format("accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                accessKey, 
                amount, 
                encodedExtraData, 
                ipnUrl, 
                momoOrderId, 
                orderInfo, 
                partnerCode, 
                redirectUrl, 
                requestId, 
                requestType);

        System.out.println("Raw Signature: " + rawSignature);

        // Generate HMAC SHA256 signature
        String signature = hmacSHA256(rawSignature, secretKey);

        // Create request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("partnerCode", partnerCode);
        requestBody.put("partnerName", "Test");
        requestBody.put("storeId", "MomoTestStore");
        requestBody.put("requestId", requestId);
        requestBody.put("amount", amount);
        requestBody.put("orderId", momoOrderId);
        requestBody.put("orderInfo", orderInfo);
        requestBody.put("redirectUrl", redirectUrl);
        requestBody.put("ipnUrl", ipnUrl);
        requestBody.put("lang", "vi");
        requestBody.put("requestType", requestType);
        requestBody.put("autoCapture", true);
        requestBody.put("extraData", encodedExtraData);
        requestBody.put("orderGroupId", "");
        requestBody.put("signature", signature);

        // Log request body for debugging
        System.out.println("Request body: " + new ObjectMapper().writeValueAsString(requestBody));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        return restTemplate.postForObject("https://test-payment.momo.vn/v2/gateway/api/create", entity, Map.class);
    }

    private String getStringValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value != null ? value.toString() : null;
    }

    private String hmacSHA256(String data, String secret) throws Exception {
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256Hmac.init(secretKey);
        byte[] signedBytes = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

        // Sửa từ Base64 sang hex để khợp với JavaScript và MoMo spec
        StringBuilder result = new StringBuilder();
        for (byte b : signedBytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}