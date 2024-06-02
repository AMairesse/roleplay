"use client";
import { useState } from 'react';
import { createWorld, deleteWorld } from '@/utils/directus';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Divider } from '@/components/divider'
import { Label } from '@/components/fieldset'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Text } from '@/components/text'
import { Textarea } from '@/components/textarea'

export default function FormCreateWorlds({ onDelete, onClose, world, ready }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [background, setBackground] = useState('');

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    createWorld({ name, background })
      .then(result => {
        console.log("OK", result);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <Heading>Aventure</Heading>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>Nom de l'aventure</Subheading>
            <Text>Choisi un nom qui te permette de bien identifier cette aventure parmis les autres</Text>
          </div>
          <div>
            <Input
              aria-label="World Name"
              name="name"
              placeholder="Catalyst"
              defaultValue={world?.name || ""}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </section>

        <Divider className="my-10" soft />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>Éléments à prendre en compte</Subheading>
            <Text>Histoire et informations de contextes permettant d'améliorer la pertinence des générations. Maximum 20 000 mots.</Text>
          </div>
          <div>
            <Textarea
              aria-label="World background"
              name="description"
              placeholder="Cette aventure se situe dans un monde médiéval fantastique avec de ..."
              defaultValue={world?.background || ""}
              limit={20000}
              onChange={(e) => setBackground(e.target.value)}
            />
          </div>
        </section>

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-4">
          {ready ? (
            <Button plain onClick={onDelete}>
              Supprimer
            </Button>
          ) : (
            <Button type="reset" plain onClick={onClose}>
              Annuler
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="flex-row gap-2"
          >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : "Sauvegarder"}
          </Button>
        </div>
      </form>
      <div className="justify-center flex flex-col gap-4 items-center mt-20">
        <button
          className="rounded-full text-3xl bg-red-500 cursor-pointer h-20 w-20 hover:scale-110 ease-in-out duration-200 drop-shadow-md hover:drop-shadow-xl"
          onClick={() => router.push(`/worlds/${world.id}/live`)}
        >
          <i className="fas fa-microphone" />
        </button>
        <span className="text-gray-500">Démarrer une session</span>
      </div>
    </div>
  )
}
