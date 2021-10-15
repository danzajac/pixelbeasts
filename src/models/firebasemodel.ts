import firebase from "firebase/app";

export default class FirebaseModel {
  model:
    | firebase.firestore.QueryDocumentSnapshot
    | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;
  data: firebase.firestore.DocumentData;

  id: string;

  constructor(
    _model:
      | firebase.firestore.QueryDocumentSnapshot
      | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
  ) {
    this.data = _model.data() as firebase.firestore.DocumentData;
    this.model = _model;

    this.id = _model.id;
  }
}
