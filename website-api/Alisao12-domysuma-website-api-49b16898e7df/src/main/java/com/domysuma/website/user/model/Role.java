package com.domysuma.website.user.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Role implements GrantedAuthority {

  public static final String USER = "USER";
  public static final String MODERATOR = "MODERATOR";
  public static final String ADMIN = "ADMIN";
  public static final String SUPER_ADMIN = "SUPER_ADMIN";

  private String authority;

}
