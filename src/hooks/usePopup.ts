import { useState } from 'react';
import { PopupState, PopupType, BlogPost } from '@/types';

export const usePopup = () => {
  const [popupState, setPopupState] = useState<PopupState>({
    isOpen: false,
    type: null,
    data: null,
  });

  const openPopup = (type: PopupType, data: BlogPost | null = null) => {
    setPopupState({
      isOpen: true,
      type,
      data,
    });
  };

  const closePopup = () => {
    setPopupState({
      isOpen: false,
      type: null,
      data: null,
    });
  };

  return {
    popupState,
    openPopup,
    closePopup,
  };
};