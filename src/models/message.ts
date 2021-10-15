import firebase from "firebase/app";
import FirebaseModel from "./firebasemodel";

export default class Message extends FirebaseModel {
  mine: boolean;
  
  constructor(
    _model:
      | firebase.firestore.QueryDocumentSnapshot
      | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
  ) {
    super(_model);
    this.mine = false;
  }

  setMine(account: string, tokenId: string) {
    this.mine = this.isMine(account, tokenId);
  }
  
  isMine(account: string, tokenId: string) {
    return this.data.uid ===  account && 
      this.data.tokenId === tokenId;
  }
}
