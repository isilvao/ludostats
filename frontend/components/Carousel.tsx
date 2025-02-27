import * as React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { TeamsAPI } from '@/api/teams';

export function CarouselSpacing({
  clubId,
  isTeam,
}: {
  clubId: string;
  isTeam: boolean;
}) {
  const [images, setImages] = useState<
    { imagen_url: string; titulo: string }[]
  >([]);

  useEffect(() => {
    const fetchImages = async () => {
      const teamApi = new TeamsAPI();
      try {
        let imagesData;
        if (isTeam) {
          imagesData = await teamApi.obtenerGaleriaPorEquipo(clubId);
        } else {
          imagesData = await teamApi.obtenerGaleriaPorClub(clubId);
        }
        setImages(imagesData);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [clubId, isTeam]);

  return (
    <Carousel className="w-full max-w-3xl">
      <CarouselContent className="-ml-1">
        {images.map((image, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-3">
                  <img
                    src={image.imagen_url}
                    alt={image.titulo}
                    className="w-full h-full object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
