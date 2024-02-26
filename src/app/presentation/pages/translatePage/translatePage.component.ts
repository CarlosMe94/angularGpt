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
  TextMessageBoxEvent,
  TextMessageBoxSelectComponent,
} from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-translate-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessagesComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './translatePage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TranslatePageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);

  public openAiService = inject(OpenAiService);

  public languages = signal([
    { id: 'alemán', text: 'Alemán' },
    { id: 'árabe', text: 'Árabe' },
    { id: 'bengalí', text: 'Bengalí' },
    { id: 'francés', text: 'Francés' },
    { id: 'hindi', text: 'Hindi' },
    { id: 'inglés', text: 'Inglés' },
    { id: 'japonés', text: 'Japonés' },
    { id: 'mandarín', text: 'Mandarín' },
    { id: 'portugués', text: 'Portugués' },
    { id: 'ruso', text: 'Ruso' },
  ]);

  handleMessageWithSelect({ prompt, selectedOption }: TextMessageBoxEvent) {
    const message = `Traduce a ${selectedOption}: ${prompt}`;

    this.isLoading.set(true);
    this.messages.update((prev) => [...prev, { text: message, isGpt: false }]);

    this.openAiService
      .translateText(prompt, selectedOption as string)
      .subscribe(({ message }) => {
        this.isLoading.set(false);
        this.messages.update((prev) => [
          ...prev,
          { text: message, isGpt: true },
        ]);
      });
  }
}
