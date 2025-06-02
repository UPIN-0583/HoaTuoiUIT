package com.example.backendhoatuoiuit.controller;

import com.example.backendhoatuoiuit.dto.OrderDTO;
import com.example.backendhoatuoiuit.entity.Order;
import com.example.backendhoatuoiuit.mapper.OrderMapper;
import com.example.backendhoatuoiuit.repository.OrderRepository;
import com.example.backendhoatuoiuit.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderMapper orderMapper;


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public OrderDTO getOrderById(@PathVariable Integer id) {
        return orderService.getOrderById(id);
    }

    @GetMapping("customer/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<OrderDTO> getCustomerOrderById(@PathVariable Integer id) {
        return orderService.getOrdersByCustomerId(id);
    }

    @PostMapping
    public OrderDTO createOrder(@RequestBody OrderDTO orderDTO) {
        return orderService.createOrder(orderDTO);
    }



    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderDTO updateOrder(@PathVariable Integer id, @RequestBody OrderDTO orderDTO) {
        return orderService.updateOrder(id, orderDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteOrder(@PathVariable Integer id) {
        orderService.deleteOrder(id);
    }

    @GetMapping("/revenue/date")
    @PreAuthorize("hasRole('ADMIN')")
    public BigDecimal getRevenueByDate(@RequestParam("date") String dateStr) {
        LocalDate date = LocalDate.parse(dateStr);
        return orderService.getTotalRevenueByDate(date);
    }

    @GetMapping("/revenue/month")
    @PreAuthorize("hasRole('ADMIN')")
    public BigDecimal getRevenueByMonth(@RequestParam("month") int month, @RequestParam("year") int year) {
        return orderService.getTotalRevenueByMonth(month, year);
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderDTO updateOrderStatus(@PathVariable Integer orderId, @RequestParam("status") String status) {
        return orderService.updateOrderStatus(orderId, status);
    }

    @PostMapping("/create-from-cart/{customerId}")
    @PreAuthorize("hasRole('USER')")
    public OrderDTO createOrderFromCart(@PathVariable Integer customerId) {
        return orderService.createOrderFromCart(customerId);
    }

    @PutMapping("/{orderId}/delivery-address")
    @PreAuthorize("hasRole('USER')")
    public OrderDTO updateDeliveryAddress(@PathVariable Integer orderId, @RequestParam("address") String address) {
        return orderService.updateDeliveryAddress(orderId, address);
    }

    @PutMapping("/{orderId}/payment-method")
    @PreAuthorize("hasRole('USER')")
    public OrderDTO updatePaymentMethod(@PathVariable Integer orderId, @RequestParam("paymentId") Integer paymentId) {
        return orderService.updatePaymentMethod(orderId, paymentId);
    }

    @PutMapping("/{orderId}/confirm")
    @PreAuthorize("hasRole('USER')")
    public OrderDTO confirmOrder(@PathVariable Integer orderId) {
        return orderService.confirmOrder(orderId);
    }

    @PutMapping("/{orderId}/cancel")
    @PreAuthorize("hasRole('USER')")
    public OrderDTO cancelOrder(@PathVariable Integer orderId) {
        return orderService.cancelOrder(orderId);
    }

    @PutMapping("/{orderId}/ship")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderDTO shipOrder(@PathVariable Integer orderId) {
        return orderService.shipOrder(orderId);
    }

    @PutMapping("/{orderId}/delivered")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderDTO markAsDelivered(@PathVariable Integer orderId) {
        return orderService.markAsDelivered(orderId);
    }

    @GetMapping("/orders/{id}")
    public OrderDTO getOrderWithItems(@PathVariable Integer id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        return orderService.toDTOWithItems(order);
    }

    @GetMapping("/count/today")
    @PreAuthorize("hasRole('ADMIN')")
    public long countOrdersToday() {
        LocalDate today = LocalDate.now();
        return orderService.countOrdersByDate(today);
    }

    @GetMapping("/status-count")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Long> getOrderCountByStatus() {
        return orderService.countOrdersByStatus();
    }

    @GetMapping("/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderDTO> getRecentOrders(@RequestParam(defaultValue = "5") int limit) {
        return orderService.getRecentOrders(limit)
                .stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/revenue/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, BigDecimal> getDailyRevenue(
            @RequestParam int month,
            @RequestParam int year) {
        return orderService.getDailyRevenue(month, year);
    }

    @GetMapping("/count/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Long> getDailyOrderCount(
            @RequestParam int month,
            @RequestParam int year) {
        return orderService.getDailyOrderCount(month, year);
    }

    @GetMapping("/revenue/range")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, BigDecimal> getRevenueInRange(
            @RequestParam String start,
            @RequestParam String end) {
        return orderService.getRevenueInRange(LocalDate.parse(start), LocalDate.parse(end));
    }

    @GetMapping("/count/range")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Long> getOrderCountInRange(
            @RequestParam String start,
            @RequestParam String end) {
        return orderService.getOrderCountInRange(LocalDate.parse(start), LocalDate.parse(end));
    }

    @PostMapping("/create-direct")
    @PreAuthorize("hasRole('USER')")
    public OrderDTO createOrderDirect(
            @RequestParam Integer customerId,
            @RequestParam Integer productId,
            @RequestParam Integer quantity
    ) {
        return orderService.createOrderDirect(customerId, productId, quantity);
    }



}
