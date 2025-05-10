import os
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import KFold
from sklearn.metrics import classification_report, accuracy_score
from tensorflow.keras import layers, models
from tensorflow.keras.applications import DenseNet121
from Adama_model import load_and_preprocess_image


class AdamaTrainer:
    def __init__(self, csv_path, image_dir, model_path= r"C:\Users\ohood\Downloads\Adama-all-main\Adama-all-main\src\model\adama_densenet_model.h5"):
        self.csv_path = r"C:\Users\ohood\Downloads\Adama-all-main\Adama-all-main\src\model\Eczema and  Psoriasis Merged\train\_classes.csv"
        self.image_dir = r"C:\Users\ohood\Downloads\Adama-all-main\Adama-all-main\src\model\Eczema and  Psoriasis Merged\train"
        self.model_path = model_path
        self.model = None

    def load_data(self):
        df = pd.read_csv(self.csv_path)
        df.columns = df.columns.str.strip()

        # df["filename"] = df["filename"].apply(os.path.basename)
        # df["filename"] = df.apply(lambda row: os.path.join(self.image_dir, get_subfolder(row), row["filename"]), axis=1)
        df["filename"] = df["filename"].apply(lambda x: os.path.join(self.image_dir, x))

        paths = df["filename"].values
        labels = np.array(df[["Psoriasis", "Eczema"]].values.tolist(), dtype=np.float32)
        return paths, labels

    def build_model(self):
        base_model = DenseNet121(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
        base_model.trainable = False
        model = models.Sequential([
            base_model,
            layers.GlobalAveragePooling2D(),
            layers.Dropout(0.5),
            layers.Dense(2, activation="softmax") # Using SoftMax
        ])
        model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
                      loss="categorical_crossentropy", metrics=["accuracy"])
        self.model = model

    def train(self):
        paths, labels = self.load_data()
        kf = KFold(n_splits=10, shuffle=True, random_state=42)
        fold_accuracies = []

        for fold, (train_idx, val_idx) in enumerate(kf.split(paths)):
            print(f"\n--- Fold {fold + 1}/10 ---")
            train_ds = tf.data.Dataset.from_tensor_slices((paths[train_idx], labels[train_idx]))
            train_ds = train_ds.shuffle(1000).map(load_and_preprocess_image).batch(32)

            val_ds = tf.data.Dataset.from_tensor_slices((paths[val_idx], labels[val_idx]))
            val_ds = val_ds.map(load_and_preprocess_image).batch(32)

            self.build_model()

            callbacks = [
                tf.keras.callbacks.EarlyStopping(monitor="val_loss", patience=7, restore_best_weights=True),
                tf.keras.callbacks.ReduceLROnPlateau(monitor="val_loss", patience=5, factor=0.5)
            ]

            self.model.fit(train_ds, validation_data=val_ds, epochs=10, callbacks=callbacks)
            _, val_acc = self.model.evaluate(val_ds)
            print(f"Validation Accuracy for Fold {fold + 1}: {val_acc:.2%}")
            fold_accuracies.append(val_acc)

        print(f"\n Average Validation Accuracy: {np.mean(fold_accuracies):.2%}")
        self.model.save(self.model_path)
        print(f"\n Model saved to {self.model_path}")