import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/services/user.service'

@Component({
  selector: 'app-google-login-success',
  template: `<p>Logging you in...</p>`
})
export class GoogleLoginSuccessComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // 1️⃣ Extract JWT tokens and user info from URL query parameters
    const accessToken = this.route.snapshot.queryParamMap.get('access');
    const refreshToken = this.route.snapshot.queryParamMap.get('refresh');
    const userName = this.route.snapshot.queryParamMap.get('name');
    const userEmail = this.route.snapshot.queryParamMap.get('email');

    // 2️⃣ Store tokens
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

    // 3️⃣ Store user info
    if (userName) localStorage.setItem('userName', userName);
    if (userEmail) localStorage.setItem('userEmail', userEmail);

    if(userName) {
      this.userService.setUser(userName);
    }

    // 4️⃣ Optional: fetch additional profile info here if needed

    // 5️⃣ Redirect user to the main page
    this.router.navigate(['/home']);
  }
}
