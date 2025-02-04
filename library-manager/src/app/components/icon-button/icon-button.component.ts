import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SvgLoaderService } from '../../services/svg-loader.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.css'
})
export class IconButtonComponent {
  
  svgContent!: SafeHtml;
  @Input({ required: true }) svgPath: string = "";
  @Input({ required: true }) iconId: string = "";
  @Input({ required: true }) currentColor: string = "red";
  @Input() isSelected: boolean = false;
  @Output() buttonClick = new EventEmitter<string>();
  constructor(private svgLoader: SvgLoaderService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.svgLoader.loadSvg(this.svgPath).subscribe(svg => {
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
    });
  }

  onClick() {
    this.isSelected=!this.isSelected;
    this.buttonClick.emit(this.isSelected ?this.iconId :"");
    
  }
}
