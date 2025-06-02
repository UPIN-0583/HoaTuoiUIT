package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.dto.OrderDTO;
import com.example.backendhoatuoiuit.dto.OrderItemDTO;
import com.example.backendhoatuoiuit.entity.*;
import com.example.backendhoatuoiuit.mapper.OrderMapper;
import com.example.backendhoatuoiuit.repository.CartRepository;
import com.example.backendhoatuoiuit.repository.OrderProductRepository;
import com.example.backendhoatuoiuit.repository.OrderRepository;
import com.example.backendhoatuoiuit.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderProductRepository orderProductRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private ProductRepository productRepository;

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream().map(orderMapper::toDTO).collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Integer id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        return orderMapper.toDTO(order);
    }

    public OrderDTO createOrder(OrderDTO orderDTO) {
        Order order = orderMapper.toEntity(orderDTO);
        if (order.getOrderProducts() != null) {
            BigDecimal total = order.getOrderProducts().stream()
                    .map(op -> op.getPrice()
                            .subtract(op.getDiscountApplied())
                            .multiply(BigDecimal.valueOf(op.getQuantity()))
                    )
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            order.setTotalAmount(total);
        }
        order = orderRepository.save(order);
        return orderMapper.toDTO(order);
    }

    public OrderDTO updateOrder(Integer id, OrderDTO orderDTO) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setDeliveryDate(orderDTO.getDeliveryDate());
        order.setDeliveryAddress(orderDTO.getDeliveryAddress());
        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setStatus(OrderStatus.valueOf(orderDTO.getStatus()));
        order.setNote(orderDTO.getNote());
        if (orderDTO.getPaymentId() != null) {
            Payment payment = new Payment();
            payment.setId(orderDTO.getPaymentId());
            order.setPayment(payment);
        }
        order = orderRepository.save(order);
        return orderMapper.toDTO(order);
    }

    public void deleteOrder(Integer id) {
        orderRepository.deleteById(id);
    }

    public BigDecimal getTotalRevenueByDate(LocalDate date) {
        BigDecimal total = orderRepository.getTotalRevenueByDate(date);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getTotalRevenueByMonth(int month, int year) {
        BigDecimal total = orderRepository.getTotalRevenueByMonth(month, year);
        return total != null ? total : BigDecimal.ZERO;
    }

    public void updateTotalAmount(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        BigDecimal total = order.getOrderProducts().stream()
                .map(op -> {
                    BigDecimal effectivePrice = op.getPrice().subtract(op.getDiscountApplied() != null ? op.getDiscountApplied() : BigDecimal.ZERO);
                    return effectivePrice.multiply(BigDecimal.valueOf(op.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);
        orderRepository.save(order);
    }


    public OrderDTO updateOrderStatus(Integer orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        try {
            OrderStatus status = OrderStatus.valueOf(newStatus.toUpperCase());
            order.setStatus(status);
            order = orderRepository.save(order);
            return orderMapper.toDTO(order);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid order status: " + newStatus);
        }
    }

    @Transactional
    public OrderDTO createOrderFromCart(Integer customerId) {
        // Tìm giỏ hàng theo customer
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty, cannot create order");
        }

        // Tạo đơn hàng mới
        Order newOrder = new Order();
        Customer customer = new Customer();
        customer.setId(customerId);
        newOrder.setCustomer(customer);
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setDeliveryAddress(""); // hoặc để sau người dùng nhập
        newOrder.setStatus(OrderStatus.PENDING);
        newOrder.setTotalAmount(BigDecimal.ZERO);
        newOrder = orderRepository.save(newOrder);

        BigDecimal totalAmount = BigDecimal.ZERO;

        // Chuyển từng sản phẩm trong cart thành order_product
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            BigDecimal price = product.getPrice();
            BigDecimal discountPercent = getDiscountPercentForProduct(product); // Ví dụ: 10.00 = 10%

            // Tính tiền giảm theo %
            BigDecimal discountApplied = price.multiply(discountPercent)
                    .divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_HALF_UP);

            // Tính tiền sau giảm
            BigDecimal priceAfterDiscount = price.subtract(discountApplied);

            // Tạo OrderProduct
            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setOrder(newOrder);
            orderProduct.setProduct(product);
            orderProduct.setQuantity(cartItem.getQuantity());
            orderProduct.setPrice(price);
            orderProduct.setDiscountApplied(discountApplied);

            orderProductRepository.save(orderProduct);

            // Cộng vào tổng tiền đơn hàng
            totalAmount = totalAmount.add(
                    priceAfterDiscount.multiply(BigDecimal.valueOf(cartItem.getQuantity()))
            );
        }

        // Cập nhật tổng tiền vào đơn hàng
        newOrder.setTotalAmount(totalAmount);
        orderRepository.save(newOrder);

        // Xoá giỏ hàng sau khi tạo đơn
        cart.getItems().clear();
        cartRepository.save(cart);

        return orderMapper.toDTO(newOrder);
    }


    public OrderDTO updateDeliveryAddress(Integer orderId, String newAddress) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setDeliveryAddress(newAddress);
        order = orderRepository.save(order);

        return orderMapper.toDTO(order);
    }

    public OrderDTO updatePaymentMethod(Integer orderId, Integer paymentId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = new Payment();
        payment.setId(paymentId);

        order.setPayment(payment);
        order = orderRepository.save(order);

        return orderMapper.toDTO(order);
    }

    public OrderDTO confirmOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getDeliveryAddress() == null || order.getDeliveryAddress().isBlank()) {
            throw new RuntimeException("Delivery address is required before confirming order");
        }
        if (order.getPayment() == null) {
            throw new RuntimeException("Payment method is required before confirming order");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Only PENDING orders can be confirmed");
        }

        order.setStatus(OrderStatus.PROCESSING);
        order = orderRepository.save(order);

        return orderMapper.toDTO(order);
    }

    public OrderDTO cancelOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel shipped or delivered orders");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order = orderRepository.save(order);

        return orderMapper.toDTO(order);
    }

    public OrderDTO shipOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.PROCESSING) {
            throw new RuntimeException("Only orders in PROCESSING status can be shipped");
        }

        order.setStatus(OrderStatus.SHIPPED);
        order = orderRepository.save(order);

        return orderMapper.toDTO(order);
    }

    public OrderDTO markAsDelivered(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.SHIPPED) {
            throw new RuntimeException("Only orders in SHIPPED status can be marked as delivered");
        }

        order.setStatus(OrderStatus.DELIVERED);
        order = orderRepository.save(order);

        return orderMapper.toDTO(order);
    }

    public OrderDTO toDTOWithItems(Order order) {
        OrderDTO dto = orderMapper.toDTO(order);

        List<OrderItemDTO> itemDTOs = order.getOrderProducts().stream().map(op -> {
            OrderItemDTO item = new OrderItemDTO();
            item.setProductId(op.getProduct().getId());
            item.setProductName(op.getProduct().getName());
            item.setQuantity(op.getQuantity());
            item.setPrice(op.getPrice());
            return item;
        }).collect(Collectors.toList());

        dto.setItems(itemDTOs);
        return dto;
    }

    private BigDecimal getDiscountPercentForProduct(Product product) {
        LocalDateTime now = LocalDateTime.now();

        return product.getProductDiscounts().stream()
                .map(ProductDiscount::getPromotion)
                .filter(p -> p.getIsActive()
                        && !now.isBefore(p.getStartDate())
                        && !now.isAfter(p.getEndDate()))
                .map(Promotion::getDiscountValue) // Đây là % (VD: 10.00)
                .findFirst()
                .orElse(BigDecimal.ZERO);
    }

    public long countOrdersByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();                  // 00:00
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();        // ngày mai 00:00
        return orderRepository.countByOrderDateBetween(startOfDay, endOfDay);
    }


    public Map<String, Long> countOrdersByStatus() {
        List<Object[]> results = orderRepository.countGroupByStatus();
        return results.stream().collect(Collectors.toMap(
                r -> r[0].toString(),
                r -> (Long) r[1]
        ));
    }


    public List<Order> getRecentOrders(int limit) {
        return orderRepository.findTopByOrderByCreatedAtDesc(PageRequest.of(0, limit));
    }

    public Map<String, BigDecimal> getDailyRevenue(int month, int year) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Order> orders = orderRepository.findByOrderDateBetween(
                start.atStartOfDay(),
                end.plusDays(1).atStartOfDay()
        );

        // Group doanh thu theo ngày
        Map<String, BigDecimal> revenuePerDay = new TreeMap<>();
        for (Order order : orders) {
            String dateStr = order.getOrderDate().toLocalDate().toString();
            BigDecimal amount = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;

            revenuePerDay.put(dateStr, revenuePerDay.getOrDefault(dateStr, BigDecimal.ZERO).add(amount));
        }

        return revenuePerDay;
    }

    public Map<String, Long> getDailyOrderCount(int month, int year) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Order> orders = orderRepository.findByOrderDateBetween(
                start.atStartOfDay(),
                end.plusDays(1).atStartOfDay()
        );

        Map<String, Long> countPerDay = new TreeMap<>();
        for (Order order : orders) {
            String dateStr = order.getOrderDate().toLocalDate().toString();
            countPerDay.put(dateStr, countPerDay.getOrDefault(dateStr, 0L) + 1);
        }

        return countPerDay;
    }

    public Map<String, BigDecimal> getRevenueInRange(LocalDate startDate, LocalDate endDate) {
        List<Order> orders = orderRepository.findByOrderDateBetween(
                startDate.atStartOfDay(),
                endDate.plusDays(1).atStartOfDay()
        );

        Map<String, BigDecimal> revenuePerDay = new TreeMap<>();
        for (Order order : orders) {
            String dateStr = order.getOrderDate().toLocalDate().toString();
            BigDecimal amount = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;
            revenuePerDay.put(dateStr, revenuePerDay.getOrDefault(dateStr, BigDecimal.ZERO).add(amount));
        }

        return revenuePerDay;
    }

    public Map<String, Long> getOrderCountInRange(LocalDate startDate, LocalDate endDate) {
        List<Order> orders = orderRepository.findByOrderDateBetween(
                startDate.atStartOfDay(),
                endDate.plusDays(1).atStartOfDay()
        );

        Map<String, Long> countPerDay = new TreeMap<>();
        for (Order order : orders) {
            String dateStr = order.getOrderDate().toLocalDate().toString();
            countPerDay.put(dateStr, countPerDay.getOrDefault(dateStr, 0L) + 1);
        }

        return countPerDay;
    }

    public List<OrderDTO> getOrdersByCustomerId(Integer customerId) {
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        return orders.stream().map(orderMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public OrderDTO createOrderDirect(Integer customerId, Integer productId, Integer quantity) {
        if (quantity <= 0) {
            throw new RuntimeException("Số lượng sản phẩm phải lớn hơn 0");
        }

        // Lấy sản phẩm từ CSDL
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // Tính giá và giảm giá
        BigDecimal price = product.getPrice();
        BigDecimal discountPercent = getDiscountPercentForProduct(product); // VD: 10%
        BigDecimal discountApplied = price.multiply(discountPercent)
                .divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_HALF_UP);
        BigDecimal priceAfterDiscount = price.subtract(discountApplied);

        // Tạo đối tượng đơn hàng
        Order order = new Order();
        Customer customer = new Customer();
        customer.setId(customerId);
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setDeliveryAddress(""); // sẽ cập nhật sau
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(priceAfterDiscount.multiply(BigDecimal.valueOf(quantity)));

        order = orderRepository.save(order);

        // Tạo OrderProduct
        OrderProduct orderProduct = new OrderProduct();
        orderProduct.setOrder(order);
        orderProduct.setProduct(product);
        orderProduct.setQuantity(quantity);
        orderProduct.setPrice(price);
        orderProduct.setDiscountApplied(discountApplied);

        orderProductRepository.save(orderProduct);

        return orderMapper.toDTO(order);
    }




}
