package com.example.backendhoatuoiuit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class ChatResponse {
    private String suggestion;
    private List<Map<String, Object>> cards;
}
