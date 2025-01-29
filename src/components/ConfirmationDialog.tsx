import React from 'react';
import { IonModal, IonContent, IonButton } from '@ionic/react';

const ConfirmationDialog: React.FC<{ message: string; onConfirm: () => void; onCancel: () => void }> = ({ message, onConfirm, onCancel }) => {
  try {
    return (
      <IonModal isOpen={true} onDidDismiss={onCancel}>
        <IonContent>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>{message}</h3>
            <IonButton expand="block" color="primary" onClick={onConfirm}>
              Confirmer
            </IonButton>
            <IonButton expand="block" color="light" onClick={onCancel}>
              Annuler
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    );
  } catch (error) {
    console.error('Failed to render confirmation dialog:', error);
    return null;
  }
};

export default ConfirmationDialog;