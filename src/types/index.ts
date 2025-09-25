export interface BlogPost {
    id: number;
    title: string;
    author: string;
    content: string;
    status: 'draft' | 'published';
    createdAt: string;
  }
  
  export interface BlogFormData {
    title: string;
    author: string;
    content: string;
    status: 'draft' | 'published';
  }
  
  export type PopupType = 'create' | 'edit' | 'delete' | 'view' | null;
  
  export interface PopupState {
    isOpen: boolean;
    type: PopupType;
    data: BlogPost | null;
  }
  
  export interface CommonPopupProps {
    open: boolean;
    onClose: () => void;
    type: PopupType;
    data: BlogPost | null;
    onConfirm?: (data?: BlogFormData) => void;
    title?: string;
    message?: string;
  }
  
  export interface BlogTableProps {
    posts: BlogPost[];
    onPopupOpen: (type: PopupType, data?: BlogPost | null) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
  }
  export interface BlogFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: BlogFormData) => void;
    editPost?: BlogPost | null;
    }
    
    export interface ViewPostProps {
    post: BlogPost | null;
    open: boolean;
    onClose: () => void;
    }
    
    