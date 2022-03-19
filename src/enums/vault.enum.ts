export enum VaultStatusEnum {
  NOT_SET = 'notSet',
  SET_NEW_NOT_READY = 'setNewNotReady',
  SET_EXISTING_NOT_READY = 'setExistingNotReady',
  READY_TO_INDEX = 'readyToIndex',
  INDEX_PENDING = 'indexPending',
  INDEXED_NO_DATA = 'indexedNoData',
  INDEXED_WITH_DATA = 'indexedWithData',
}
