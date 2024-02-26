import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ChatMessagesComponent,
  MyMessageComponent,
  TypingLoaderComponent,
  TextMessageBoxComponent,
  GptMessageEditableComponent,
} from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-image-tunning-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessagesComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    GptMessageEditableComponent,
  ],
  templateUrl: './imageTunningPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTunningPageComponent {
  public messages = signal<Message[]>([
    {
      isGpt: true,
      text: 'Dummy',
      imageInfo: {
        alt: 'Dummy Image',
        url: 'http://localhost:3000/gpt/image-generation/1708691420357.png',
      },
    },
  ]);
  public isLoading = signal(false);

  public openAiService = inject(OpenAiService);

  public originalImage = signal<string | undefined>(undefined);
  public maskImage = signal<string | undefined>(undefined);

  handleMessage(prompt: string) {
    this.isLoading.set(true);

    this.messages.update((prev) => [...prev, { isGpt: false, text: prompt }]);

    this.openAiService
      .imageGeneration(prompt, this.originalImage(), this.maskImage())
      .subscribe((res) => {
        this.isLoading.set(false);
        if (!res) return;
        this.messages.update((prev) => [
          ...prev,
          { isGpt: true, text: res.url, imageInfo: res! },
        ]);
      });
  }

  handleImageChange(newImage: string, originalImage: string) {
    this.originalImage.set(originalImage);
    this.maskImage.set(newImage);

    // console.log({ newImage, originalImage });
  }

  generateVariation() {
    this.isLoading.set(true);

    // this.messages.update((prev) => [...prev, { isGpt: false, text: 'Prueba' }]);

    this.openAiService
      .imageVariation(this.originalImage()!)
      .subscribe((res) => {
        this.isLoading.set(false);
        if (!res) return;
        this.messages.update((prev) => [
          ...prev,
          { isGpt: true, text: res.url, imageInfo: res! },
        ]);
      });
  }
}
