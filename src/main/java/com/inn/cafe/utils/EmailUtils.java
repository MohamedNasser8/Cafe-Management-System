package com.inn.cafe.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Properties;

@Service
public class EmailUtils {
    @Autowired
    JavaMailSenderImpl emailSender;

    public void sendSimpleMessage(String to, String subject, String text, List<String> list) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("nassermohamed3222@gmail.com");
        message.setSubject(subject);
        message.setText(text);
        message.setTo(to);
        if (list != null && list.size() > 0)
            message.setCc(getCcArray(list));
        emailSender.send(message);
    }

    private String[] getCcArray(List<String> ccList) {
        String[] cc = new String[ccList.size()];
        for (int i = 0; i < ccList.size(); i++)
            cc[i] = ccList.get(i);
        return cc;
    }
}
