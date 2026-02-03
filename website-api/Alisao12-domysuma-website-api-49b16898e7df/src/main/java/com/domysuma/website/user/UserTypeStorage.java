package com.domysuma.website.user;

import com.domysuma.website.user.data.enums.UserType;

public class UserTypeStorage {
    private static final InheritableThreadLocal<UserType> userType = new InheritableThreadLocal<>();

    public static void setUserType(UserType userType) {
        UserTypeStorage.userType.set(userType);
    }

    public static UserType getUserType() {
        return userType.get();
    }

    public static void clear() {
        if (userType.get() != null) {
            userType.remove();
        }
    }
}
