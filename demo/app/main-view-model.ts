import { Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import { Page } from "tns-core-modules/ui/page";
import { fromAsset, fromUrl } from "tns-core-modules/image-source";
import { Image } from "tns-core-modules/ui/image";
import { ImageAsset } from "tns-core-modules/image-asset";
import { screen } from "tns-core-modules/platform";
import { CameraPlus } from "@nstudio/nativescript-camera-plus";
import { ObservableProperty } from "./observable-property";

export class HelloWorldModel extends Observable {
  private _counter: number = 0;
  @ObservableProperty() public cam: CameraPlus;
  @ObservableProperty() public cameraHeight: number;

  constructor(page: Page) {
    super();

    this.cameraHeight = screen.mainScreen.heightDIPs * 0.45;

    this.cam = page.getViewById("camPlus") as CameraPlus;

    // hide a default icon button here
    // this.cam.showGalleryIcon = false

    if (this._counter > 0) {
      return;
    }

    this.cam.on(CameraPlus.errorEvent, args => {
      console.log("*** CameraPlus errorEvent ***", args);
    });

    this.cam.on(CameraPlus.toggleCameraEvent, (args: any) => {
      console.log(`toggleCameraEvent listener on main-view-model.ts  ${args}`);
    });

    this.cam.on(CameraPlus.photoCapturedEvent, (args: any) => {
      console.log(`photoCapturedEvent listener on main-view-model.ts  ${args}`);
      console.log((<any>args).data);
      fromAsset((<any>args).data).then(res => {
        const testImg = topmost().getViewById("testImagePickResult") as Image;
        testImg.src = res;
      });
    });

    this.cam.on(CameraPlus.imagesSelectedEvent, (args: any) => {
      console.log(`imagesSelectedEvent listener on main-view-model.ts ${args}`);
    });

    this.cam.on(CameraPlus.videoRecordingReadyEvent, (args: any) => {
      console.log(`videoRecordingReadyEvent listener fired`, args.data);
    });

    this.cam.on(CameraPlus.videoRecordingStartedEvent, (args: any) => {
      console.log(`videoRecordingStartedEvent listener fired`, args.data);
    });

    this.cam.on(CameraPlus.videoRecordingFinishedEvent, (args: any) => {
      console.log(`videoRecordingFinishedEvent listener fired`, args.data);
    });

    this._counter = 1;
  }

  public recordDemoVideo() {
    try {
      console.log(`*** start recording ***`);
      this.cam.record();
    } catch (err) {
      console.log(err);
    }
  }

  public stopRecordingDemoVideo() {
    try {
      console.log(`*** stop recording ***`);
      this.cam.stop();
      console.log(`*** after this.cam.stop() ***`);
    } catch (err) {
      console.log(err);
    }
  }

  public toggleFlashOnCam() {
    this.cam.toggleFlash();
  }

  public toggleShowingFlashIcon() {
    console.log(`showFlashIcon = ${this.cam.showFlashIcon}`);
    this.cam.showFlashIcon = !this.cam.showFlashIcon;
  }

  public toggleTheCamera() {
    this.cam.toggleCamera();
  }

  public openCamPlusLibrary() {
    this.cam.chooseFromLibrary().then(
      (images: Array<ImageAsset>) => {
        console.log("Images selected from library total:", images.length);
        for (let source of images) {
          console.log(`source = ${source}`);
        }
        const testImg = topmost().getViewById("testImagePickResult") as Image;
        const firstImg = images[0];
        console.log(firstImg);
        fromAsset(firstImg)
          .then(res => {
            const testImg = topmost().getViewById(
              "testImagePickResult"
            ) as Image;
            testImg.src = res;
          })
          .catch(err => {
            console.log(err);
          });
      },
      err => {
        console.log("Error -> " + err.message);
      }
    );
  }

  public takePicFromCam() {
    this.cam.takePicture({ saveToGallery: true });
  }
}
