"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import classes from "./index.module.css";
import ButtonIcon from "../Button/Button-icon";
import Button from "../Button/Button";
import Image from "next/image";
import { Good } from "../GoodList/GoodList";
import removeIcon from "@/public/closegray.svg";
import { blobURL, goodsFavorites, myGoodsURL } from "@/swr/fetcher";
import { mutate } from "swr";
import { useCategories } from "@/hooks/useCategories";

export default function FormCreateGood({ good, onClose, saveEditGood }: { good?: Good, onClose?: () => void, saveEditGood?: (createdGood: { title: string, price: number, description: string, image: string[] }) => Promise<void> }) {
  const [title, setTitle] = useState(good?.title || '');
  const [price, setPrice] = useState<number | string>(good?.price || '');
  const [description, setDescription] = useState(good?.description || '');
  const [categoryId, setCategoryId] = useState(good?.categoryId || '');
  const { data: categories } = useCategories();
  const [images, setImages] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>(good?.image || []);
  const [preview, setPreview] = useState<string[]>(good?.image || []);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return

    const isDuplicate = images.some(img => img.name === file.name && img.size === file.size);

    if (isDuplicate) {
      setError('Такое изображение уже есть');
      setTimeout(()=>{setError('')}, 2000)
      return
    }

    setImages(prev => [...prev, file]);
    setPreview(prev => [...prev, URL.createObjectURL(file)]);
  };

  const removeImage = (index: number) => {
    if (index < uploadedImages.length) {
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
      setPreview(prev => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - uploadedImages.length;
      setImages(prev => prev.filter((_, i) => i !== newIndex));
      setPreview(prev => prev.filter((_, i) => i !== index));
    }
  };

  const uploadImages = async () => {

    const uploadTask = images.map(async image => {
      const formData = new FormData();
      formData.append('image', image);

      const res = await fetch(blobURL, {method: 'POST', body: formData})
      if(!res.ok) throw new Error("Ошибка загрузки");
      const data = await res.json()
      return data;
    })

    return Promise.all(uploadTask);
  }

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true)
    console.log('sf');
    
    try {
      const imagesUrl = images.length > 0 ? await uploadImages() : [];

      const goodData = {
        id: good?.id,
        title,
        price: +price,
        description,
        categoryId,
        image: [...imagesUrl, ...uploadedImages]
      }

      if (saveEditGood && onClose) {
        onClose();
        saveEditGood(goodData);
      } else {
        const res = await fetch(goodsFavorites, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...goodData, type: 'goods' })
        })
        if (!res.ok) setError('Ошибка на серверe')
        mutate(myGoodsURL, undefined, true)
        router.push('/account');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false)
    }
  };


  return <form  className={classes.form} onSubmit={submitForm}>
    {good && <ButtonIcon onClick={onClose} width={30} height={50} src={removeIcon} title="закрыть" alt="удалить" />}
    {error && <p>{error}</p>}
    <input type="hidden" name="id" value={good?.id} />


    <div className={classes.filePreview} >
      {preview && preview.length > 0 && preview.map((src, index) => (
        src ? (
          <div key={index} className={classes.previewItem}>
            <Image width={200} height={300} src={src} alt={`Превью ${index + 1}`} />
            <ButtonIcon
              src={removeIcon}
              height={50}
              width={24}
              title="удалить"
              alt="удалить"
              onClick={() => removeImage(index)}
            />
          </div>
        ) : null
      ))}
    </div>
    <>
      <label htmlFor="upload-good" className={classes.label}>
        Выберите файл
      </label>
      <input
        id="upload-good"
        type="file"
        accept="image/*"
        className={classes.upload}
        onChange={uploadImage} />
    </>
    <label>
      Заголовок:
      <input minLength={3} type="text" name="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
    </label>

    <label>
      Цена (₽):
      <input className={classes.price} type="text" name="price" value={price} onChange={(event) => {
        const value = event.target.value;
        if (/^\d*$/.test(value)) {
          setPrice(value);
        }
      }} 
      required  
      inputMode="numeric"
      pattern="\d*"/>
      
    </label>

    <label>
      Категория:
      <select name="category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required>
        <option value="">Выберите категорию</option>
        {categories?.map((cat) =>
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        )}
      </select>
    </label>

    <label>
      Описание:
      <textarea minLength={10} maxLength={300} name="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
    </label>

    <Button type="submit" disabled={isSubmitting}>{saveEditGood ? 'Сохранить изменения' : 'Разместить объявление'}</Button>

  </form>
}