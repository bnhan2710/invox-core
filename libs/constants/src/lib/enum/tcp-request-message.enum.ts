export enum INVOICE {
  CREATE = 'invoice.create',
  GET_BY_ID = 'invoice.get_by_id',
  UPDATE_BY_ID = 'invoice.update_by_id',
  DELETE_BY_ID = 'invoice.delete_by_id',
  SEND = 'invoice.send',
  UPDATE_INVOICE_PAID = 'invoice.update_invoice_paid',
}

export enum PRODUCT {
  CREATE = 'product.create',
  GET_LIST = 'product.get_list',
}

export enum USER {
  CREATE = 'user.create',
  GET_ALL = 'user.get_all',
  GET_BY_ID = 'user.get_by_id',
}

export enum KEYCLOAK {
  CREATE_USER = 'keycloak.create_user',
}

export enum AUTHORIZER {
  LOGIN = 'authorizer.login',
  VERIFY_USER_TOKEN = 'authorizer.verify_user_token',
}

export enum PDF_GENERATOR {
  CREATE_INVOICE_PDF = 'pdf.create_invoice_pdf',
}

export enum MEDIA {
  UPLOAD_FILE = 'media.upload_file',
  DELETE_FILE = 'media.delete_file',
}

export const TCP_REQUEST_MESSAGE = {
  INVOICE,
  PRODUCT,
  PDF_GENERATOR,
  AUTHORIZER,
  USER,
  KEYCLOAK,
  MEDIA,
};
