package com.example.backendhoatuoiuit.config;

import com.example.backendhoatuoiuit.entity.Customer;
import com.example.backendhoatuoiuit.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Đổi sang PasswordEncoder

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra xem đã có dữ liệu chưa để tránh thêm trùng
        if (customerRepository.count() == 0) {
            // Nguyễn Văn A
            Customer customer1 = new Customer();
            customer1.setName("Nguyễn Văn A");
            customer1.setEmail("nguyenvana@example.com");
            customer1.setPhone("0987654321");
            customer1.setAddress("123 Đường Hoa Sen, TP.HCM");
            customer1.setPasswordHash(passwordEncoder.encode("password123"));
            customer1.setIsActive(true);
            customer1.setRole("USER");
            customerRepository.save(customer1);

            // Trần Thị B
            Customer customer2 = new Customer();
            customer2.setName("Trần Thị B");
            customer2.setEmail("tranthib@example.com");
            customer2.setPhone("0912345678");
            customer2.setAddress("456 Đường Hoa Cúc, Hà Nội");
            customer2.setPasswordHash(passwordEncoder.encode("password123"));
            customer2.setIsActive(true);
            customer2.setRole("USER");
            customerRepository.save(customer2);

            // Lê Văn C
            Customer customer3 = new Customer();
            customer3.setName("Lê Văn C");
            customer3.setEmail("levanc@example.com");
            customer3.setPhone("0934567890");
            customer3.setAddress("789 Đường Hoa Mai, Đà Nẵng");
            customer3.setPasswordHash(passwordEncoder.encode("password123"));
            customer3.setIsActive(false);
            customer3.setRole("USER");
            customerRepository.save(customer3);

            // Phạm Thị D
            Customer customer4 = new Customer();
            customer4.setName("Phạm Thị D");
            customer4.setEmail("phamthid@example.com");
            customer4.setPhone("0971234567");
            customer4.setAddress("101 Đường Hoa Hồng, Cần Thơ");
            customer4.setPasswordHash(passwordEncoder.encode("password123"));
            customer4.setIsActive(true);
            customer4.setRole("USER");
            customerRepository.save(customer4);

            // Admin
            Customer admin = new Customer();
            admin.setName("Admin");
            admin.setEmail("admin@example.com");
            admin.setPhone("0901234567");
            admin.setAddress("1 Đường Admin, TP.HCM");
            admin.setPasswordHash(passwordEncoder.encode("password123"));
            admin.setIsActive(true);
            admin.setRole("ADMIN");
            customerRepository.save(admin);
        }
    }
}