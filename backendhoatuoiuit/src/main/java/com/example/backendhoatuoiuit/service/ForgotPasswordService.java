package com.example.backendhoatuoiuit.service;

import com.example.backendhoatuoiuit.entity.ForgotPassword;
import com.example.backendhoatuoiuit.entity.Customer;
import com.example.backendhoatuoiuit.repository.ForgotPasswordRepository;
import com.example.backendhoatuoiuit.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ForgotPasswordService {
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private ForgotPasswordRepository forgotPasswordRepository;
    @Autowired
    private JavaMailSender mailSender;
    public Map<String, Object> sendCode(String userEmail) {
        Map<String, Object> response = new HashMap<>();
        Optional<Customer> userOpt = customerRepository.findByEmail(userEmail);
        if (userOpt.isPresent()) {
            Customer user = userOpt.get();
            int code = (int) (1001 + Math.random() * 8999);

            ForgotPassword forgotPassword = forgotPasswordRepository.findByEmail(userEmail)
                .orElse(new ForgotPassword());
            forgotPassword.setEmail(userEmail);
            forgotPassword.setCode(code);
            forgotPasswordRepository.save(forgotPassword);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("TnTech@gmail.com");
            message.setTo(userEmail);
            message.setSubject("Mã xác nhận");
            message.setText("Chào " + user.getName() + ",\n"
                + "Để hoàn tất quy trình, vui lòng nhập mã xác nhận dưới đây:\n"
                + "Mã xác nhận của bạn là: " + code + "\n"
                + "Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi để được hỗ trợ.\n"
                + "Trân trọng,\nHoa tươi UIT");
            mailSender.send(message);

            response.put("success", true);
            response.put("message", "Mã xác nhận đã được gửi");
        } else {
            response.put("success", false);
            response.put("message", "Email không chính xác");
        }
        return response;
    }
} 