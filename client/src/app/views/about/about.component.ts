import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit {

  branches = [
    { name: '209 3rd Parklands Ave, Nairobi', lat: -1.2572590474174388, lng: 36.811666150607486 },
    { name: 'Kimathi St, Nyeri', lat: -0.39254869933033826, lng: 36.963231694784255 },
    { name: 'Nyamira Road, Kisii', lat: -0.5535400027395075, lng: 34.92740053896647 },
    { name: 'Isibenia Road, Kisii', lat: -1.0403493846667202, lng: 34.47578718129646 },
    { name: 'Luanda- Siaya Rd, Siaya', lat: 0.056486203481857976, lng: 34.29133275443163 },
    { name: 'Mombasa, Kenya', lat: -4.021726969295295, lng: 39.71934286258888 },
    { name: 'Kitale, Kenya', lat: 1.0129485150199333, lng: 35.00309531012409 },
    { name: 'Eldoret, Kenya', lat: 0.519196466263904, lng: 35.27122692559312 },
    { name: 'Kilifi, Kenya', lat: -3.632187016205523, lng: 39.84828941015347 },
    { name: 'West Pokot, Kenya', lat: 1.2535045665069005, lng: 35.091601765941995 },
    { name: 'Kajiado, Kenya', lat: -1.8413552788168903, lng: 36.7912921947929 }
  ];

  ngAfterViewInit(): void {
    this.loadGoogleMaps();
  }

  /** Load Google Maps dynamically */
  private loadGoogleMaps(): void {
    if ((window as any).google && (window as any).google.maps) {
      this.initMap();
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyBKSRofRSMWWGOfSVeO6JfAKj1_KfATndk';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      this.initMap();
    };

    document.head.appendChild(script);
  }

  /** Initialize the map and markers with standard red pins */
  private initMap(): void {
    const mapElement = document.getElementById('map') as HTMLElement;

    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    const google = (window as any).google;

    const map = new google.maps.Map(mapElement, {
      center: { lat: -0.023559, lng: 37.906193 }, // Center on Kenya
      zoom: 6
    });

    // Add standard red markers
    this.branches.forEach(branch => {
      const marker = new google.maps.Marker({
        position: { lat: branch.lat, lng: branch.lng },
        map,
        title: branch.name
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<strong>${branch.name}</strong>`
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });
  }
}
