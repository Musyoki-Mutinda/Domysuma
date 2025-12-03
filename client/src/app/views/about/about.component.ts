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
    { name: 'Luanda- Siaya Rd, Siaya', lat: 0.056486203481857976, lng: 34.29133275443163 }
  ];

  ngAfterViewInit(): void {
    this.loadGoogleMaps();
  }

  /** Load Google Maps dynamically (NO callback param!) */
  private loadGoogleMaps(): void {
    if ((window as any).google && (window as any).google.maps) {
      this.initMap();
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyBKSRofRSMWWGOfSVeO6JfAKj1_KfATndk&libraries=marker';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      this.initMap();
    };

    document.head.appendChild(script);
  }

  /** Initialize the map and markers */
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

    // Add markers
    this.branches.forEach(branch => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: branch.lat, lng: branch.lng },
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
