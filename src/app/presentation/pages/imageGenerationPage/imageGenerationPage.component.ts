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
} from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-image-generation-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessagesComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './imageGenerationPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageGenerationPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);

  public openAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
    this.isLoading.set(true);

    this.messages.update((prev) => [...prev, { isGpt: false, text: prompt }]);

    this.openAiService.imageGeneration(prompt).subscribe((res) => {
      this.isLoading.set(false);
      if (!res) return;
      this.messages.update((prev) => [
        ...prev,
        { isGpt: true, text: res.url, imageInfo: res! },
      ]);
    });
  }
}
