import {
  Component,
  Input,
  Output,
  EventEmitter,
} from 'angular2/core'
import {
  FORM_DIRECTIVES,
  Validators,
  FormBuilder,
  ControlGroup
} from 'angular2/common'

@Component({
  selector: 'post-form',
  template: require('./postForm.html'),
  styles: [require('./postForm.scss')],
  directives: [FORM_DIRECTIVES],
})
export class PostForm {
  @Input() post: any
  @Output() submit = new EventEmitter(false)
  postForm: ControlGroup

  constructor(formBuilder: FormBuilder) {
    this.postForm = this.createPostForm(formBuilder)
  }

  private createPostForm(formBuilder: FormBuilder) {
    return formBuilder.group({
      'title': ['', Validators.compose([
        Validators.required,
      ])],
      'body': ['', Validators.compose([
        Validators.required,
        Validators.minLength(25),
        Validators.maxLength(300)
      ])]
    })
  }
}
