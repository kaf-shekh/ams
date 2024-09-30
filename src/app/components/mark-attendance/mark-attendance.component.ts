import { Component, ElementRef, EventEmitter, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { AttendanceModel, User } from 'src/app/models/User';
import { AttendanceService } from 'src/app/services/attendance.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.scss']
})
export class MarkAttendanceComponent implements OnInit, OnDestroy {


  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  capturedImage!: string | null;
  isVideoPlaying: boolean = false;
  @Output() complete = new EventEmitter<boolean>();
  currentUser: any;

  constructor(private attendanceService: AttendanceService, private commonService: CommonService,
    private auth: AuthenticationService, private router: Router) {
    auth.currentUser.subscribe(user => this.currentUser = user);
  }

  ngOnInit() {
    this.startWebcam();
  }

  startWebcam() {
    try {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          this.isVideoPlaying = true;
          setTimeout(() => {
            const video: HTMLVideoElement = this.videoElement.nativeElement;
            video.srcObject = stream;
            video.play();
          }, 0);

        })
        .catch((err) => {
          console.error("Error accessing the webcam: ", err);
        });
    } catch (error) {

    }
  }

  captureImage() {
    try {
      const video: HTMLVideoElement = this.videoElement.nativeElement;
      const canvas: HTMLCanvasElement = this.canvas.nativeElement;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.capturedImage = canvas.toDataURL('image/png');
      }
    } catch (error) {

    }
  }

  captureRetake() {
    try {
      if (this.capturedImage) {
        this.capturedImage = null;
        this.startWebcam();
      } else {
        this.captureImage();
        // this.stopWebcam()
      }
    } catch (error) {

    }

  }

  stopWebcam() {
    try {
      if (!this.videoElement?.nativeElement) {
        return
      }
      const video: HTMLVideoElement = this.videoElement.nativeElement;
      const stream = video.srcObject as MediaStream;
      const tracks = stream.getTracks();

      tracks.forEach(track => {
        track.stop(); // Stops each track (video stream)
      });

      video.srcObject = null;
      this.isVideoPlaying = false;
    } catch (error) {

    }
  }
  save() {
    try {
      if (!this.capturedImage || this.capturedImage == null) {
        return
      }
      let req: AttendanceModel = {
        id: this.commonService.generateCryptoId(16),
        date: new Date(),
        img: this.capturedImage || "",
        userId: this.currentUser.id,
        managerId: this.currentUser.managerId
      }
      this.attendanceService.addAttendence(req).subscribe((x) => {
        console.log(x);
        this.router.navigate(['/attendance'], { queryParams: { id: this.currentUser.id } })
        this.close();
      })
    } catch (error: any) {
    }
  }

  close() {
    this.stopWebcam();
  }
  ngOnDestroy() {
    this.stopWebcam();
  }
}
