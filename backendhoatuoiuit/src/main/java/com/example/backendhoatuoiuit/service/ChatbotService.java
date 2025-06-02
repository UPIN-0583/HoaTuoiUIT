package com.example.backendhoatuoiuit.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.example.backendhoatuoiuit.utils.SlugUtils.createSlug;

@Service
public class ChatbotService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final String OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
    @Value("${openrouter.api.key}")
    private String OPENROUTER_API_KEY;

    public String askOpenRouter(String question) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(OPENROUTER_API_KEY);

        Map<String, Object> payload = Map.of(
                "model", "deepseek/deepseek-r1-0528:free",
                "messages", List.of(
                        Map.of("role", "system", "content", "Bạn là chuyên gia gợi ý hoa tại Việt Nam. Luôn trả lời bằng tiếng Việt. Khi người dùng hỏi, hãy trả lời tên từ 2 đến 3 loại hoa, mỗi tên hoa phải đầy đủ, bao gồm từ 'hoa' và tên loại, không thêm chi tiết khác."),
                        Map.of("role", "user", "content", question)
                )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(OPENROUTER_API_URL, request, Map.class);
            if (response.getBody() == null || response.getBody().get("choices") == null) {
                return "OpenRouter không trả về dữ liệu.";
            }
            List choices = (List) response.getBody().get("choices");
            if (choices.isEmpty()) {
                return "Không có phản hồi từ OpenRouter.";
            }
            Map msg = (Map) ((Map) choices.get(0)).get("message");
            return msg.get("content").toString();
        } catch (Exception e) {
            e.printStackTrace();  // Log lỗi
            return "Lỗi khi gọi OpenRouter: " + e.getMessage();
        }
    }


//    public String askOpenRouter(String question) {
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.setBearerAuth(OPENROUTER_API_KEY);
//
//        Map<String, Object> payload = Map.of(
//                "model", "mistralai/mistral-nemo:free",  // Model miễn phí
//                "messages", List.of(
//                        Map.of("role", "system", "content", "Bạn là chuyên gia gợi ý hoa. Khi người dùng hỏi, hãy trả lời tên từ 2 đến 3 loại hoa, mỗi tên hoa phải đầy đủ, bao gồm từ 'hoa' và tên loại, không thêm chi tiết khác."),
//                        Map.of("role", "user", "content", question)
//                )
//        );
//
//        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
//        RestTemplate restTemplate = new RestTemplate();
//        ResponseEntity<Map> response = restTemplate.postForEntity(OPENROUTER_API_URL, request, Map.class);
//
//        // Lấy phần trả lời từ phản hồi
//        Map msg = (Map) ((Map) ((List) response.getBody().get("choices")).get(0)).get("message");
//        return msg.get("content").toString();
//    }

//    public String generateFinalResponse(String question) {
//        String aiResponse = askOpenRouter(question);
//
//        // Lấy danh sách hoa active từ DB
//        List<String> matchedFlowers = jdbcTemplate.queryForList(
//                "SELECT name FROM flowers WHERE is_active = TRUE", String.class
//        );
//
//        List<String> replies = new ArrayList<>();
//        for (String flower : matchedFlowers) {
//            if (aiResponse.toLowerCase().contains(flower.toLowerCase())) {
//                List<String> productLinks = jdbcTemplate.query(
//                        "SELECT p.id, p.name\n" +
//                                "FROM products p\n" +
//                                "JOIN product_flower pf ON p.id = pf.product_id\n" +
//                                "JOIN flowers f ON f.id = pf.flower_id\n" +
//                                "WHERE f.name ILIKE ? AND p.is_active = TRUE\n" +
//                                "LIMIT 2;\n",
//                        new Object[]{"%" + flower + "%"}, // flower từ flowers.name
//                        (rs, rowNum) -> {
//                            String productName = rs.getString("name");
//                            int productId = rs.getInt("id");
//                            // Bạn có thể trả về slug từ name hoặc chỉ id
//                            return "https://hoatuoiuit.id.vn/products/" + createSlug(productName);  // hoặc "/products/" + productId
//                        }
//                );
//                ;
//
//                if (!productLinks.isEmpty()) {
//                    String links = String.join("\n", productLinks.stream()
//                            .map(link -> "👉 [Xem sản phẩm](" + link + ")")
//                            .toList());
//                    replies.add("🌸 " + flower + " – " + links);
//                } else {
//                    replies.add("🌸 " + flower + " – Hiện chưa có sản phẩm.");
//                }
//
//            }
//        }
//
//        // Nếu AI không trả về kết quả rõ ràng hoặc không khớp DB, vẫn trả lời AI
//        return replies.isEmpty() ? aiResponse : String.join("\n", replies);
//    }

//    public List<Map<String, Object>> generateFinalResponse(String question) {
//        String aiResponse = askOpenRouter(question);
//
//        // Lấy danh sách hoa active từ DB
//        List<String> matchedFlowers = jdbcTemplate.queryForList(
//                "SELECT name FROM flowers WHERE is_active = TRUE", String.class
//        );
//
//        List<Map<String, Object>> finalResponse = new ArrayList<>();
//
//        for (String flower : matchedFlowers) {
//            if (aiResponse.toLowerCase().contains(flower.toLowerCase())) {
//                List<Map<String, String>> productList = jdbcTemplate.query(
//                        "SELECT p.id, p.name, p.image_url " +
//                                "FROM products p " +
//                                "JOIN product_flower pf ON p.id = pf.product_id " +
//                                "JOIN flowers f ON f.id = pf.flower_id " +
//                                "WHERE f.name ILIKE ? AND p.is_active = TRUE " +
//                                "LIMIT 3;",
//                        new Object[]{"%" + flower + "%"},
//                        (rs, rowNum) -> {
//                            String productName = rs.getString("name");
//                            String productUrl = "https://hoatuoiuit.id.vn/products/" + createSlug(productName);
//                            String imageUrl = rs.getString("image_url");
//                            return Map.of(
//                                    "link", productUrl,
//                                    "image", imageUrl
//                            );
//                        }
//                );
//
//                if (!productList.isEmpty()) {
//                    String firstImage = productList.get(0).get("image");
//                    List<String> links = productList.stream().map(p -> p.get("link")).toList();
//
//                    finalResponse.add(Map.of(
//                            "flower", flower,
//                            "image", firstImage,
//                            "links", links
//                    ));
//                } else {
//                    finalResponse.add(Map.of(
//                            "flower", flower,
//                            "image", null,
//                            "links", List.of()
//                    ));
//                }
//            }
//        }
//
//        return finalResponse.isEmpty() ? List.of(Map.of("message", aiResponse)) : finalResponse;
//    }

//    public Map<String, Object> generateFinalResponse(String question) {
//        String aiResponse = askOpenRouter(question);
//
//        // Lấy danh sách hoa active từ DB
//        List<String> matchedFlowers = jdbcTemplate.queryForList(
//                "SELECT name FROM flowers WHERE is_active = TRUE", String.class
//        );
//
//        List<Map<String, Object>> flowerCards = new ArrayList<>();
//        List<String> flowerNamesInResponse = new ArrayList<>();
//
//        for (String flower : matchedFlowers) {
//            if (aiResponse.toLowerCase().contains(flower.toLowerCase())) {
//                flowerNamesInResponse.add(flower);
//
//                List<Map<String, Object>> productList = jdbcTemplate.query(
//                        "SELECT p.id, p.name, p.image_url " +
//                                "FROM products p " +
//                                "JOIN product_flower pf ON p.id = pf.product_id " +
//                                "JOIN flowers f ON f.id = pf.flower_id " +
//                                "WHERE f.name ILIKE ? AND p.is_active = TRUE " +
//                                "LIMIT 3;",  // Lấy tối đa 3 sản phẩm, hoặc bỏ LIMIT nếu muốn lấy hết
//                        new Object[]{"%" + flower + "%"},
//                        (rs, rowNum) -> {
//                            String productName = rs.getString("name");
//                            String productUrl = "https://hoatuoiuit.id.vn/products/" + createSlug(productName);
//                            String imageUrl = rs.getString("image_url");
//                            return Map.of(
//                                    "flower", flower,
//                                    "productName", productName,  // Thêm tên sản phẩm
//                                    "image", imageUrl,
//                                    "link", productUrl
//                            );
//                        }
//                );
//
//                if (!productList.isEmpty()) {
//                    flowerCards.addAll(productList);
//                } else {
//                    flowerCards.add(Map.of(
//                            "flower", flower,
//                            "productName", null,
//                            "image", null,
//                            "link", null,
//                            "message", "Hiện chưa có sản phẩm."
//                    ));
//                }
//            }
//        }
//
//        // Xử lý tên hoa từ AI không khớp DB
//        List<String> flowerTokensFromAI = List.of(aiResponse.split("[,\\s]+"));
//        for (String flowerToken : flowerTokensFromAI) {
//            String flowerName = flowerToken.trim();
//            if (!flowerName.isEmpty() && !flowerNamesInResponse.contains(flowerName)) {
//                flowerCards.add(Map.of(
//                        "flower", flowerName,
//                        "productName", null,
//                        "image", null,
//                        "link", null,
//                        "message", "Hiện chưa có sản phẩm."
//                ));
//                flowerNamesInResponse.add(flowerName);
//            }
//        }
//
//        String suggestion = flowerNamesInResponse.isEmpty()
//                ? aiResponse
//                : "Shop gợi ý cho bạn: " + String.join(", ", flowerNamesInResponse) + ".";
//
//        return Map.of(
//                "suggestion", suggestion,
//                "cards", flowerCards
//        );
//    }


    public Map<String, Object> generateFinalResponse(String question) {
        String aiResponse = askOpenRouter(question);
        System.out.println("AI Response: " + aiResponse);

        // Phần DB query
        List<String> matchedFlowers = jdbcTemplate.queryForList(
                "SELECT name FROM flowers WHERE is_active = TRUE", String.class
        );
        System.out.println("Matched Flowers from DB: " + matchedFlowers);

        // Sau mỗi truy vấn DB
        List<Map<String, Object>> flowerCards = new ArrayList<>();
        List<String> flowerNamesInResponse = new ArrayList<>();

        for (String flower : matchedFlowers) {
            if (aiResponse.toLowerCase().contains(flower.toLowerCase())) {
                flowerNamesInResponse.add(flower);
                try {
                    List<Map<String, Object>> productList = jdbcTemplate.query(
                            "SELECT p.id, p.name, p.image_url FROM products p JOIN product_flower pf ON p.id=pf.product_id JOIN flowers f ON f.id=pf.flower_id WHERE f.name ILIKE ? AND p.is_active=TRUE LIMIT 3",
                            new Object[]{"%" + flower + "%"},
                            (rs, rowNum) -> Map.of(
                                    "flower", flower,
                                    "productName", rs.getString("name"),
                                    "image", rs.getString("image_url"),
                                    "link", "/products/" + createSlug(rs.getString("name"))
                            )
                    );
                    System.out.println("Product list for " + flower + ": " + productList);
                    if (!productList.isEmpty()) {
                        flowerCards.addAll(productList);
                    } else {
                        flowerCards.add(Map.of(
                                "flower", flower,
                                "productName", null,
                                "image", null,
                                "link", null,
                                "message", "Hiện chưa có sản phẩm."
                        ));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    flowerCards.add(Map.of(
                            "flower", flower,
                            "productName", null,
                            "image", null,
                            "link", null,
                            "message", "Lỗi khi truy vấn DB: " + e.getMessage()
                    ));
                }
            }
        }

        // Log kết quả
        System.out.println("Final flower cards: " + flowerCards);
        String suggestion = flowerNamesInResponse.isEmpty() ? aiResponse : "Shop gợi ý cho bạn: " + String.join(", ", flowerNamesInResponse) + ".";
        return Map.of("suggestion", suggestion, "cards", flowerCards);
    }



}
