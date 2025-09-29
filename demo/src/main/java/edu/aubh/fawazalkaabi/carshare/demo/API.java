package edu.aubh.fawazalkaabi.carshare.demo;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/")
public class API {

    @GetMapping("version")
    public String getVersionString() {
        return "1";
    }
    
    @GetMapping("test")
    public String testString() {
        return "Hello";
    }
    
}
