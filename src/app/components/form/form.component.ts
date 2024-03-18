import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {

  form!: FormGroup;
  states: any[] = [];
  cities: any[] = [];
  selectedFiles: File[] = [];

  constructor(
    private _fb: FormBuilder,
    private _formservice: FormService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadStates();
  }

  createForm() {
    this.form = this._fb.group({
      fname: [''],
      lname: [''],
      age: [''],
      profile: [''],
      experience: [''],
      educationalDetails: this._fb.array([]),
      address1: [''],
      address2: [''],
      state: [''],
      city: [[]],
      country: ['India']
    });
  }

  loadStates() {
    this._formservice.getState().subscribe((res: any) => {
      this.states = res;
    });
  }

  onFileChange(event: any) {
    this.selectedFiles = [];
    const files: FileList | null = event.target?.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files.item(i)!);
      }
    }
  }

  onStateChange(event: any) {
    const stateId = event.target?.value;
    if (stateId) {
      const selectedState = this.states.find(state => state.stateId == stateId);
      this.cities = selectedState ? selectedState.city : [];
    } else {
      this.cities = [];
    }
  }

  get educationalDetails(): FormArray {
    return this.form.get('educationalDetails') as FormArray;
  }

  addEducationDetail() {
    const educationDetailGroup = this._fb.group({
      institute: [''],
      qualification: ['']
    });
    this.educationalDetails.push(educationDetailGroup);
  }

  removeEducationDetail(index: number) {
    this.educationalDetails.removeAt(index);
  }

  onSubmit() {
    const selectedState = this.states.find(state => state.stateId == this.form.value.state);
    const selectedCities = this.form.value.city.map((cityId: any) => {
      const city = this.cities.find(city => city.cityId == cityId);
      return city ? city.cityName : '';
    });

    const formData = {
      first_name: this.form.value.fname,
      last_name: this.form.value.lname,
      age: this.form.value.age,
      address: {
        address_line_1: this.form.value.address1,
        address_line_2: this.form.value.address2,
        state: selectedState ? selectedState.stateName : '',
        city: selectedCities,
        country: this.form.value.country
      },
      educational_details: this.form.value.educationalDetails.map((detail: any) => ({
        education_institute: detail.institute,
        qualification: detail.qualification
      })),
      profile: this.form.value.profile,
      experience: this.selectedFiles
    };

    console.log(formData);
  }

}
