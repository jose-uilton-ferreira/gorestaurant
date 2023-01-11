import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import { api } from '../../services/api';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { Food as FoodData } from '../../types';
import { Food } from '../../components/Food';

export function Dashboard() {
  const [foods, setFoods] = useState<FoodData[]>([]);
  const [editingFood, setEditingFood] = useState<FoodData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get<FoodData[]>("/foods");
      setFoods(response.data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(food: FoodData) {
    try {
      const response = await api.post<FoodData>('/foods', {
        ...food,
        available: true,
      });

      setFoods((state) => [...state, response.data]);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdateFood(food: FoodData) {
    try {
      const foodUpdated = await api.put<FoodData>(
        `/foods/${editingFood!.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen((state) => !state);
  }

  function toggleEditModal() {
    setEditModalOpen((state) => !state);
  }

  function handleEditFood(food: FoodData) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood!}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
