import { Component, Input, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-movie-information',
  standalone: true,
  imports: [],
  templateUrl: './movie-information.component.html',
  styleUrl: './movie-information.component.scss'
})
export class MovieInformationComponent {

  idx? : WritableSignal<number>

  @Input()
  set id(id: number) {
    this.idx = signal(id)
  }

}
