import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { StorageService } from '../../../../core/services/storage/storage';
import { FunctionsService } from '../../../../core/services/functions/functions';

@Component({
  selector: 'app-translator',
  imports: [JsonPipe, FormsModule],
  templateUrl: './translator.html',
  styleUrls: ['./translator.scss'],
})
export class Translator {
  audioFile: File | null = null;
  recordedBlob: Blob | null = null;
  mediaRecorder: MediaRecorder | null = null;
  isRecording: boolean = false;
  isProcessing: boolean = false;

  tipoInput: string = 'es';
  functionResponse: any = null;

  constructor(
    private storageService: StorageService,
    private functionsService: FunctionsService
  ) {}

  onFileSelected(event: any) {
    if (this.isRecording) {
      alert('No puedes subir un archivo mientras estás grabando.');
      return;
    }
    if (this.audioFile) {
      alert('Ya hay un archivo, elimínalo antes de subir otro.');
      return;
    }
    this.audioFile = event.target.files[0] || null;
  }

  async startRecording() {
    if (this.audioFile) {
      alert('Ya tienes un archivo subido. Elimínalo antes de grabar.');
      return;
    }
    if (this.isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      this.mediaRecorder.ondataavailable = (e: any) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        this.recordedBlob = new Blob(chunks, { type: 'audio/wav' });
        this.audioFile = new File(
          [this.recordedBlob!],
          `recorded_${Date.now()}.wav`
        );
        this.mediaRecorder = null;
        this.isRecording = false;
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      console.log('Grabación iniciada...');
    } catch (err) {
      console.error('Error al iniciar grabación:', err);
      alert('No se pudo iniciar la grabación. Revisa permisos de micrófono.');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      console.log('Grabación detenida.');
    }
  }

  removeAudio() {
    this.audioFile = null;
    this.recordedBlob = null;
    this.functionResponse = null;
  }

  async processAudio(tipo: string = 'es') {
    if (!this.audioFile) {
      alert('Selecciona o graba un audio primero.');
      return;
    }

    this.isProcessing = true; // Habilita barra de carga
    try {
      const fileId = await this.storageService.uploadFile(this.audioFile);

      const execution = await this.functionsService.executeBabelFunction({
        file_id: fileId,
        tipo,
      });

      if (execution.responseBody) {
        this.functionResponse = {
          response: JSON.parse(execution.responseBody),
        };
      } else {
        this.functionResponse = execution;
      }

      console.log('Respuesta Babel:', this.functionResponse);
    } catch (error: any) {
      console.error('Error procesando audio:', error);
      this.functionResponse = { error: error.message };
    } finally {
      this.isProcessing = false; // Oculta barra y habilita botón
    }
  }
}
