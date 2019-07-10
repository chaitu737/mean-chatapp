import { Component, OnInit, Input, Output, SimpleChanges,EventEmitter } from '@angular/core';


@Component({
  selector: 'first-char',
  templateUrl: './first-char.component.html',
  styleUrls: ['./first-char.component.scss']
})
export class FirstCharComponent implements OnInit {
  @Input() name: string;
  @Input() userBg: string;
  @Input() userColor: string;


  @Output() notify: EventEmitter<string> =
  new EventEmitter();

  public firstChar: string;

  private _name:string = '';
  

  


  constructor() { }

  ngOnInit() {
    this._name = this.name;
 this.firstChar = this._name[0];
 
  }

ngOnChanges(changes:SimpleChanges){
  let name = changes.name;
  this._name = name.currentValue;
  this.firstChar = this._name[0];

}

nameClicked(){
  this.notify.emit(this._name);
}

}
