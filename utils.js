import { useRef, useEffect } from 'react';

export function getListData(data) {
  console.log('get list data', data);
  const listData = data.reduce((acc, item) => {

    acc.push(
      [
        {
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          image: item.image,
          category: item.category
        }
      ]
    );

    return acc;
  }, []);

  return listData;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
