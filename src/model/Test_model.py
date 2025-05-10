import os
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import KFold
from sklearn.metrics import classification_report, accuracy_score
from tensorflow.keras import layers, models
from tensorflow.keras.applications import DenseNet121
from Adama_model import load_and_preprocess_image
from sklearn.metrics import classification_report, accuracy_score


class AdamaTester:
    def __init__(self, csv_path, image_dir, model_path= r"C:\Users\ohood\Downloads\Adama-all-main\Adama-all-main\src\model\adama_densenet_model.h5"):
        self.csv_path = r"C:\Users\ohood\Downloads\Adama-all-main\Adama-all-main\src\model\Eczema and  Psoriasis Merged\test\_classes.csv"
        self.image_dir = r"C:\Users\ohood\Downloads\Adama-all-main\Adama-all-main\src\model\Eczema and  Psoriasis Merged\test"
        self.model_path = model_path
        self.model = tf.keras.models.load_model(model_path)

    def load_data(self):
        df = pd.read_csv(self.csv_path)
        df.columns = df.columns.str.strip()
        # df["filename"] = df["filename"].apply(os.path.basename)
        # df["filename"] = df.apply(lambda row: os.path.join(self.image_dir, get_subfolder(row), row["filename"]), axis=1)
        df["filename"] = df["filename"].apply(lambda x: os.path.join(self.image_dir, x))

        paths = df["filename"].values
        labels = np.array(df[["Psoriasis", "Eczema"]].values.tolist(), dtype=np.float32)
        return paths, labels

    def test(self):
        paths, labels = self.load_data()
        ds = tf.data.Dataset.from_tensor_slices((paths, labels)).map(load_and_preprocess_image).batch(32)

        loss, acc = self.model.evaluate(ds)
        print(f"\n Final Test Accuracy: {acc:.2%}")

        y_true, y_pred, per_image_accuracies = [], [], []

        THRESHOLD = 0.5  # Confidence threshold for declaring 'Unknown'
        CLASS_NAMES = ["Psoriasis", "Eczema"]  # Update if more classes are added

        for i, (images, labels) in enumerate(ds):
            predictions = self.model.predict(images)

            for j in range(len(predictions)):
                probs = predictions[j]  # Softmax output for one image
                top_class_idx = np.argmax(probs)
                confidence = probs[top_class_idx]

                # Determine label
                predicted_label = CLASS_NAMES[top_class_idx] if confidence >= THRESHOLD else "Unknown"
                true_label = CLASS_NAMES[np.argmax(labels[j])]

                if predicted_label != "Unknown":  # only evaluate when confident
                    y_true.append(true_label)
                    y_pred.append(predicted_label)

                # Display results
                prob_str = ", ".join([f"{CLASS_NAMES[k]}: {probs[k]:.2f}" for k in range(len(CLASS_NAMES))])
                print(f"\n Image {i*len(predictions)+j+1}")
                print(f" True Label: {true_label}")
                print(f" Predicted Probabilities → {prob_str}")
                print(f" Final Prediction: {predicted_label} (Confidence: {confidence:.2f})")


        print("\n✅ Classification Report:")
        print(classification_report(y_true, y_pred, target_names=["Psoriasis", "Eczema"]))

        accuracy = accuracy_score(y_true, y_pred)
        print(f"\n✅ Overall Accuracy: {accuracy * 100:.2f}%")