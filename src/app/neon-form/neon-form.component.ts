import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  Component,
  Input,
  ViewEncapsulation,
  OnDestroy,
  TemplateRef,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  KeyValueDiffer,
  KeyValueDiffers,
  Inject,
  AfterContentChecked, Directive, ElementRef, ViewChild, AfterViewChecked
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';

export enum Direction {
  Next,
  Prev
}

export enum Animation {
  Fade = 'fade',
  Slide = 'slide'
}

export interface ActiveSlides {
  previous: number;
  current: number;
  next: number;
}


@Component({
  selector: 'app-neon-form',
  templateUrl: './neon-form.component.html',
  styleUrls: ['./neon-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NeonFormComponent implements OnInit, AfterViewChecked {
  formatSizes: Array<{ size: string, width: number, url: string }> = [{
    size: 'S', width: 20, url: '../.././assets/Fichier-S.png'
  },
  { size: 'M', width: 25, url: '../.././assets/Fichier-M.png' },
  { size: 'L', width: 30, url: '../.././assets/Fichier-L.png' },
  { size: 'XL', width: 40, url: '../.././assets/Fichier-XL.png' }];
  selectedFormatSize = null;
  imageSupportSelected = null;
  projectType = null;
  userChoices = {};
  userInfoPerso = {};
  trim = String.prototype.trim;
  suceMaBite = ' créant votre espace !';
  finalStep = false;
  signUp = true;
  styleSelected = null;
  signUpError = 'Il existe déjà un compte avec cet email...';
  loginFailed = false;
  textInput = '';
  neonColorCode = '';
  neonTypoClass = 'Billie';
  neonColorClass = '';
  selectedColor;
  selectedTypo = 'TheAbsolute';
  imageFile = '';
  loading = false;
  mainChoice = '';
  imageAdditionalInfo = '';
  selectedColorUI = null;
  allUsers = [];
  closeResult: string;
  colorTitle = 'Choisissez une couleur';
  slides = [
    {
      url: '../.././assets/Billie-16.png',
      font: 'Billie'
    },
    {
      url: '../.././assets/Cobby-16.png',
      font: 'Cobby'
    },
    {
      url: '../.././assets/Jackie-16.png',
      font: 'Jackie'
    },
    {
      url: '../.././assets/Jerry-16.png',
      font: 'Jerry'
    },
    {
      url: '../.././assets/Jimmy-16.png',
      font: 'Jimmy'
    },
    {
      url: '../.././assets/Johnny-16.png',
      font: 'Johnny'
    },
    {
      url: '../.././assets/Perrie-16.png',
      font: 'Perrie'
    },
  ];

  colorList = [
    { name: 'blancFroid', color: '#ffffff', url: '../.././assets/blanc.png' },
    { name: 'blanchaud', color: '#ddcaaf', url: '../.././assets/blanchaud.png' },
    { name: 'orange', color: '#ffa42c', url: '../.././assets/orange.png' },
    { name: 'jaune', color: '#ffe600', url: '../.././assets/jaune.png' },
    { name: 'rouge', color: '#ff0000', url: '../.././assets/rouge.png' },
    { name: 'rose', color: '#ff73ff', url: '../.././assets/rose.png' },
    { name: 'fuschia', color: '#df29ff', url: '../.././assets/fuschia.png' },
    { name: 'violet', color: '#9527ff', url: '../.././assets/violet.png' },
    { name: 'bleu', color: '#337dff', url: '../.././assets/bleu.png' },
    { name: 'vert', color: '#15e81f', url: '../.././assets/vert.png' },
    { name: 'turquoise', color: '#17fff9', url: '../.././assets/turquoise.png' },
  ];
  @Input()
  isNavigationVisible = true;
  @Input()
  isThumbnailsVisible = true;
  @Input()
  animation: Animation = Animation.Fade;
  @Input()
  autoPlayDuration = 0;
  @Input()
  slideTemplateRef: TemplateRef<any>;
  @Input()
  thumbnailTemplateRef: TemplateRef<any>;
  currentInterval;
  differ: KeyValueDiffer<ActiveSlides, any>;
  @ViewChild("mainInput",  {static: false}) mainInp: ElementRef;
  editName() {
      this.mainInp.nativeElement.focus();
  }
  private _direction: Direction = Direction.Next;
  get direction() {
    return this._direction;
  }
  set direction(direction: Direction) {
    this._direction = direction;
  }

  private _activeSlides: ActiveSlides;
  get activeSlides() {
    return this._activeSlides;
  }
  set activeSlides(activeSlides: ActiveSlides) {
    this._activeSlides = activeSlides;
  }
  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private differs: KeyValueDiffers, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.http.get('https://neon-server.herokuapp.com/users').subscribe((users: Array<any>) => {
      this.allUsers = users;
    });
    // this.neonColorClass = this.colorList.find(x => x.name === 'violet').name;
    if (this.slides) {
      this.activeSlides = this.getPreviousCurrentNextIndexes(0);
      this.differ = this.differs.find(this.activeSlides).create();
    }
  }

  ngAfterViewChecked() {
    // this.mainInp.nativeElement.focus();
  }

  goToEC() {
    window.top.location.href = "https://www.dessinemoiunneon.fr/espace-personnel";

  }

  goToAcceuil() {
    window.top.location.href = "https://www.dessinemoiunneon.fr";

  }
  signuptrue() {
    this.userInfoPerso['password'] = '';
    this.userInfoPerso['name'] = '';
    this.userInfoPerso['nickname'] = '';
    if (this.signUp) {
      this.suceMaBite = ' créant votre espace !';

    } else {
      this.suceMaBite = ' vous connectant !';

    }

    this.signUp = !this.signUp;
  }
  onSelectColor(color, index) {
    this.neonColorClass = color['name'];
    this.neonColorCode = color['color'];
    this.selectedColorUI = index;
    this.selectedColor = color['name'];
    this.colorTitle = 'Couleur selectionnée:  ';
  }
  onChangeTextTitle(value: string) {
    this.textInput = value;
  }
  onSelectFile(event) {
    console.log('file selected', event);
    if (event.target.files) {
      console.log('file selected', event.target.files);
      this.textInput = event.target.files[0]['name'];
      this.imageFile = event.target.files[0];
    }
  }
  onChangeAdditionnalInfo(value: string) {
    if (value.trim() !== '') {
      this.imageAdditionalInfo = value;
    }
  }

  manageFinalStep() {
    this.finalStep = true
    // if(this.projectType === null) {
    //   this.projectType === 'consumer'
    // }
    this.loading = false;
  }

  exitForm() {

  }
  async onSubmitForm() {
    const payload: Array<{ title: string, data: {} }> = [];
    if (this.mainChoice === 'text') {
      payload.push({ title: this.mainChoice, data: { value: this.textInput, style: this.styleSelected } });
      payload.push({ title: 'format', data: { size: this.formatSizes[this.selectedFormatSize], imageSupport: this.imageSupportSelected } });


    } else {
      payload.push({ title: this.mainChoice, data: { file: this.imageFile, info: this.imageAdditionalInfo } });
      payload.push({ title: 'format', data: { size: this.formatSizes[this.selectedFormatSize], imageSupport: this.imageSupportSelected } });

    }

    const data = {};
    for (const field in this.userInfoPerso) {
      data[field] = this.userInfoPerso[field];
    }
    payload.push({ title: this.projectType, data: { data } });
    const commandPayload = {
      text: this.textInput,
      typo: this.selectedTypo,
      colors: this.selectedColor,
      support: this.imageSupportSelected,
      imageAdditionalInfo: this.imageAdditionalInfo,
      height: this.formatSizes[this.selectedFormatSize].width,
      // price: Math.floor(Math.random() * 2000) + 1 ,
      state: 'created',
      type: this.projectType
    };


    if (localStorage.getItem('email') === null) {
      if ((this.userInfoPerso['email'] || this.userInfoPerso['password']) && (this.userInfoPerso['email'].trim() !== '' || this.userInfoPerso['password'].trim() !== '')) {
        this.loginFailed = false;
        this.loading = true;
        this.getUser().subscribe((allUsers: Array<any>) => {
          console.log('all the users , ', allUsers);
          if (allUsers) {
            if (allUsers.find(x => x['email'] === this.userInfoPerso['email'])) {
              this.loginFailed = true;
              const userId = allUsers.find(x => x['email'] === this.userInfoPerso['email']).id;
              this.signUpError = 'Il existe déjà un compte avec cet email...';
              if (this.mainChoice === 'image') {
                if (this.imageFile) {
                  commandPayload['clientImageUrl'] = '';
                  console.log('sending image CaaaaaaC', userId);

                  const params = new HttpParams().set('userId', userId)// Create new HttpParams
                  const formData: FormData = new FormData();
                  formData.append('file', this.imageFile);
                  this.http.post('https://neon-server.herokuapp.com/clientFileUpload', formData, { params: params }).subscribe((url) => {
                    console.log('sucess URL:', url);
                    commandPayload['clientImageUrl'] = url;
                    return url;
                  }, err => {
                    if (err['status'] === 200) {

                    }
                  });
                } else {
                  alert('vous devez choisir une image')
                }
                this.sleep(1000);

              }
              console.log('upload file finished', commandPayload['clientImageUrl'])

              this.http.post(`https://neon-server.herokuapp.com/users/${userId}/command`, commandPayload).subscribe((newNeonList: any) => {
                console.log('updated list after post :', newNeonList);
                this.saveToStorage();
                this.manageFinalStep();
                console.log('debu 4');

              }, err => {
                if (err.status === 201 || err.status === 200) {
                  console.log('debu 5');

                  this.saveToStorage();
                  this.manageFinalStep();
                }
              });
            } else {
              this.loginFailed = false;
              this.signUpError = 'Vous devez fournir un email et un mot de passe...';
              console.log('debu 2');

              this.signUpObs().subscribe(() => {
                this.loading = false;
                this.http.get('https://neon-server.herokuapp.com/users').subscribe((users: Array<any>) => {
                  this.allUsers = users;
                  this.saveToStorage();
                  const userId = this.allUsers.find(x => x.email === this.userInfoPerso['email']).id;
                  if (this.mainChoice === 'image') {
                    if (this.imageFile) {
                      commandPayload['clientImageUrl'] = '';
                      console.log('sending image CaaaaaaC', userId);

                      const params = new HttpParams().set('userId', userId)// Create new HttpParams
                      const formData: FormData = new FormData();
                      formData.append('file', this.imageFile);
                      this.http.post('https://neon-server.herokuapp.com/clientFileUpload', formData, { params: params }).subscribe((url) => {
                        console.log('sucess URL:', url);
                        commandPayload['clientImageUrl'] = url;
                        return url;
                      }, err => console.log('err', err));
                    } else {
                      alert('vous devez choisir une image')
                    }
                    this.sleep(1000);

                  }
                  console.log('upload file finished', commandPayload['clientImageUrl'])
                  this.http.post(`https://neon-server.herokuapp.com/users/${userId}/command`, commandPayload).subscribe((newNeonList: any) => {
                    console.log('updated list after post :', newNeonList);


                    this.saveToStorage();
                    this.manageFinalStep();
                    console.log('debu 4');


                  }, err => {
                    if (err.status === 201 || err.status === 200) {


                      this.saveToStorage();
                      this.manageFinalStep();
                      console.log('debu 4');


                    }
                  });
                });

              }, err => {
                if (err.status === 201 || err.status === 200) {
                  console.log('debu 6');

                  this.loading = false;
                  this.saveToStorage();
                  this.http.get('https://neon-server.herokuapp.com/users').subscribe((users: Array<any>) => {
                    this.allUsers = users;
                    const userId = this.allUsers.find(x => x.email === this.userInfoPerso['email']).id;
                    if (this.mainChoice === 'image') {
                      if (this.imageFile) {
                        commandPayload['clientImageUrl'] = '';
                        console.log('sending image CaaaaaaC', userId);

                        const params = new HttpParams().set('userId', userId)// Create new HttpParams
                        const formData: FormData = new FormData();
                        formData.append('file', this.imageFile);
                        this.http.post('https://neon-server.herokuapp.com/clientFileUpload', formData, { params: params }).subscribe((url) => {
                          console.log('sucess URL:', url);
                          commandPayload['clientImageUrl'] = url;
                          return url;
                        }, err => console.log('err', err));
                      } else {
                        alert('vous devez choisir une image')
                      }
                      this.sleep(1000);

                    }
                    console.log('upload file finished', commandPayload['clientImageUrl'])
                    this.http.post(`https://neon-server.herokuapp.com/users/${userId}/command`, commandPayload).subscribe((newNeonList: any) => {
                      console.log('updated list after post :', newNeonList);

                      this.saveToStorage();
                      this.manageFinalStep();



                    }, err => {
                      if (err.status === 201 || err.status === 200) {
                        console.log('debu 7');


                        this.saveToStorage();
                        this.manageFinalStep();

                      }
                    });
                  });
                } else {
                  alert('Signup failed'); console.log('signup failed', err);
                  this.loading = false;
                }
              });
            }
          }
        });
      } else {
        alert('Vous devez fournir un email et un mot de passe');
      }
    } else {
      console.log('debu 8', localStorage.getItem('email'));

      const userId = this.allUsers.find(x => x.email === localStorage.getItem('email')).id;
      if (this.mainChoice === 'image') {
        if (this.imageFile) {
          commandPayload['clientImageUrl'] = '';
          console.log('sending image CaaaaaaC', userId);

          const params = new HttpParams().set('userId', userId)// Create new HttpParams
          const formData: FormData = new FormData();
          formData.append('file', this.imageFile);
          this.http.post('https://neon-server.herokuapp.com/clientFileUpload', formData, { params: params }).subscribe((url) => {
            console.log('sucess URL:', url);
            commandPayload['clientImageUrl'] = url;
            return url;
          }, err => console.log('err', err));
        } else {
          alert('vous devez choisir une image')
        }
        this.sleep(1000);

      }
      console.log('upload file finished', commandPayload['clientImageUrl'])
      this.http.post(`https://neon-server.herokuapp.com/users/${userId}/command`, commandPayload).subscribe((newNeonList: any) => {
        console.log('updated list after post :', newNeonList);

        this.saveToStorage();
        this.manageFinalStep();

      }, err => {
        if (err.status === 201 || err.status === 200) {
          console.log('debu 9   ');

          this.saveToStorage();
          this.manageFinalStep();
        }
      });
    }


  }

  sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }
  }
  async onCompleteStep(step: number, choice: string, data: any) {
    if (choice && step === 0) {
      if (choice !== this.mainChoice) {
        this.textInput = '';
      }
      if(choice === 'text') {
        setTimeout(() => {
          this.mainInp.nativeElement.focus();
  
        }, 200);
  
      }
      this.mainChoice = choice;
      this.userChoices[step] = choice;
    }
  
    if (step === 3) {
      if (choice === 'erase') {
        this.userChoices[step] = null;
      } else {
        this.userChoices[step] = choice;

      }
    }
    if (step === 4) {
      if (choice === 'standard') {
        this.imageSupportSelected = 'standard'
      } else {
        this.userChoices[step] = choice;
        this.imageSupportSelected = 'détouré'

      }

      if (localStorage.getItem('email')) {
        this.loading = true;
        const commandPayload = {
          text: this.textInput,
          typo: this.selectedTypo,
          colors: this.selectedColor,
          support: this.imageSupportSelected,
          imageAdditionalInfo: this.imageAdditionalInfo,
          height: this.formatSizes[this.selectedFormatSize].width,
          // price: Math.floor(Math.random() * 2000) + 1 ,
          state: 'created',
          type: this.projectType
        };

        console.log('upload file finished', commandPayload['clientImageUrl'])
        const userId = this.allUsers.find(x => x.email === localStorage.getItem('email')).id;
        if (this.mainChoice === 'image') {
          if (this.imageFile) {
            commandPayload['clientImageUrl'] = '';
            console.log('sending image CaaaaaaC', userId);

            const params = new HttpParams().set('userId', userId)// Create new HttpParams
            const formData: FormData = new FormData();
            formData.append('file', this.imageFile);
            this.http.post('https://neon-server.herokuapp.com/clientFileUpload', formData, { params: params }).subscribe((url) => {
              console.log('sucess URL:', url);
              commandPayload['clientImageUrl'] = url;
              return url;
            }, err => console.log('err', err));
          } else {
            alert('vous devez choisir une image')
          }
          this.sleep(1000);

        }
        console.log('upload file finished', commandPayload['clientImageUrl'])
        this.http.post(`https://neon-server.herokuapp.com/users/${userId}/command`, commandPayload).subscribe((newNeonList: any) => {
          console.log('updated list after post :', newNeonList);
          this.manageFinalStep();
          this.saveToStorage();
        }, err => {
          if (err.status === 201 || err.status === 200) {
            console.log('debu 9   ');
            this.manageFinalStep();
            this.saveToStorage();
          }
        });
      }

    }
    if (choice && step === 5) {
      if (choice !== this.projectType) {
        this.userInfoPerso = {};
      }
      this.projectType = choice;


    }
    console.log('step ', step, ' completed. The user chose ', choice, '... data to save: ', this.projectType);

  }

  onChangeUserInfo(target: string, value: string) {
    if (value.trim() !== '') {
      this.userInfoPerso[target] = value;
    }
  }

  signUpObs() {
    const headers = new HttpHeaders({ 'content-type': 'application/json', 'Accept': 'application/json' });
    const password = this.projectType === 'consumer' ? this.userInfoPerso['password'] : this.userInfoPerso['société'];
    const payload = {
      email: this.userInfoPerso['email'],
      password: password,
      name: this.userInfoPerso['name'],
      nickname: this.userInfoPerso['nickname'],
      type: this.projectType
    };
    return this.http.post('https://neon-server.herokuapp.com/users', payload, { headers: headers });
  }

  getUser() {
    return this.http.get('https://neon-server.herokuapp.com/users');

  }


  saveToStorage() {
    if(this.userInfoPerso['email'] && this.userInfoPerso['email'].trim() !== '') {
      localStorage.setItem('email', this.userInfoPerso['email']);

    }
    if(this.userInfoPerso['password'] && this.userInfoPerso['password'].trim() !== '') {
      localStorage.setItem('pw', this.userInfoPerso['password']);
    }
  }

  select(index: number): void {
    this.activeSlides = this.getPreviousCurrentNextIndexes(index);
    this.direction = this.getDirection(this.activeSlides.current, index);
    this.neonTypoClass = this.slides[index]['font'];
    this.selectedTypo = this.slides[index]['font'];
    if (this.differ.diff(this.activeSlides)) {
      this.cd.detectChanges();
    }
  }

  getDirection(oldIndex: number, newIndex: number): Direction {
    const images = this.slides;

    if (oldIndex === images.length - 1 && newIndex === 0) {
      return Direction.Next;
    } else if (oldIndex === 0 && newIndex === images.length - 1) {
      return Direction.Prev;
    }

    return oldIndex < newIndex ? Direction.Next : Direction.Prev;
  }

  getPreviousCurrentNextIndexes(index: number): ActiveSlides {
    const images = this.slides;

    return {
      previous: (index === 0 ? images.length - 1 : index - 1) % images.length,
      current: index % images.length,
      next: (index === images.length - 1 ? 0 : index + 1) % images.length
    };
  }

  getAnimationSlideState(index: number) {
    return index === this.activeSlides.current ? 'current' : index === this.activeSlides.next ? 'next' : index === this.activeSlides.previous ? 'previous' : '';
  }

  startTimer(): void {
    this.resetTimer();

    if (this.autoPlayDuration > 0) {
      this.currentInterval = setInterval(() => this.select(this.activeSlides.next), this.autoPlayDuration);
    }
  }

  resetTimer(): void {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
    }
  }


}
