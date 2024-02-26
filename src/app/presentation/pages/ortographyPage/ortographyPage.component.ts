import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  ChatMessagesComponent,
  GptMessageOrthographyComponent,
  MyMessageComponent,
  TextMessageBoxComponent,
  TextMessageBoxEvent,
  TextMessageBoxFileComponent,
  TextMessageBoxSelectComponent,
  TextMessageEvent,
  TypingLoaderComponent,
} from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-ortography-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessagesComponent,
    GptMessageOrthographyComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './ortographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrtographyPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);

  public openAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
    this.isLoading.set(true);

    this.messages.update((prev) => [...prev, { text: prompt, isGpt: false }]);
    this.openAiService.checkOrthography(prompt).subscribe((resp) => {
      this.isLoading.set(false);
      this.messages.update((prev) => [
        ...prev,
        {
          isGpt: true,
          text: resp.message,
          info: resp,
        },
      ]);
    });
  }
}
