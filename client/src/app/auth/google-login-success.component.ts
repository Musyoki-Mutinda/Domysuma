import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-google-login-success',
  template: `<p>Logging you in...</p>`
})
export class GoogleLoginSuccessComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    // 1️⃣ Extract JWT token from URL
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      // 2️⃣ Store JWT token
      localStorage.setItem('accessToken', token);
    }

    // 3️⃣ Optional: You may fetch the logged-in user's data here
    // this.userService.loadUserProfile();

    // 4️⃣ Redirect user to your main site page
    this.router.navigate(['/']);
  }
}
