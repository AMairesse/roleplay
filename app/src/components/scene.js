import { useState } from 'react';
import { Radio, RadioGroup } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Scene({ scene }) {
  // const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  console.log("scene", scene);

  const product = {
    name: 'Passage du pont',
    href: '#',
    description:
      "Résumé de la scène:",
    //imageSrc: { scene.imageb64 },
    imageAlt: 'Image de la scène',
    breadcrumbs: [
      { id: 1, name: scene.name, href: '#' },
    ],
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-end">
          <nav aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2">
              {product.breadcrumbs.map((breadcrumb, breadcrumbIdx) => (
                <li key={breadcrumb.id}>
                  <div className="flex items-center text-sm">
                    <a href={breadcrumb.href} className="font-medium text-gray-500 hover:text-gray-900">
                      {breadcrumb.name}
                    </a>
                    {breadcrumbIdx !== product.breadcrumbs.length - 1 ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <h2 id="information-heading" className="sr-only">
              Product information
            </h2>

            {/* <div className="flex items-center">
              <p className="text-lg text-gray-900 sm:text-xl">{product.price}</p>
            </div> */}

            <div className="mt-4 space-y-6">
              <p className="text-base text-gray-500">{product.description}{scene.transcriptions.join(', \n')}</p>
            </div>

            <div className="mt-6 flex items-center">
              <i className="fas fa-check text-green-500" />
              <p className="ml-2 text-sm text-gray-500">JSON_File: {scene.image}</p>
            </div>
          </section>
        </div>

        {/* Product image */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
            <img src={`data:image/png;base64,${scene.imageb64}`} alt={product.imageAlt} className="h-full w-full object-cover object-center" />
          </div>
        </div>

        {/* Product form */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <h2 id="options-heading" className="sr-only">
              Product options
            </h2>

            <div className="mt-10">
              {/* <button
                type="submit"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Interroger la scène: ....
              </button> */}
                          <div>
              {/* <MistralComponent parentVariable={scene.transcriptions.join(', \n')} /> */}
            </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
