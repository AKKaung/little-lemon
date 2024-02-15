import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists menuitems (id integer primary key not null, name text, description text, price text, image text, category text);'
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('select * from menuitems', [], (_, { rows }) => {
        console.log(`Get_MenuList ==> ${JSON.stringify(rows._array)}`);
        resolve(rows._array);
      });
    });
  });
}

export async function saveMenuItems(menuItems) {
  return new Promise((resolve, reject) => {
    menuItems.forEach(element => {
      db.transaction((tx) => {
        tx.executeSql('insert into menuitems (id, name, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?)',
          [element.id, element.name, element.description, String(element.price), element.image, element.category],
          (_, result) => {
            console.log(`Saving_List ==> ${JSON.stringify(result)}`);
            resolve(result);
          },
          (_, error) => {
            console.log(`Saving_Error ==> ${error}`);
            reject(error);
          }
        );
      });
    });
  })
  // .then(() => console.log(`Saved ${menuItems.map((item) => console.log(`${item.id}, ${item.uuid}, ${item.title}, ${item.price}, ${item.category}`))}`))
  // .catch((err) => console.error(`Error saving menu items: ${err}`));
};

export async function filterByQueryAndCategories(query, activeCategories) {
  console.log(`Filter by Query and Categories ===> ${activeCategories}, ${query}`);
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      const result = [];
      const category = [];
      let qStr = "?";
      activeCategories.forEach((ele) => {
        category.push(ele.toLowerCase());
        qStr += ", ?";
      });
      tx.executeSql(
        "select * from menuitems where category IN (" + qStr + ")", [...category],
        (_, { rows }) => {
          console.log(`Filter_List_Data ===> ${JSON.stringify(rows._array)}`);
          rows._array.forEach((ele) => {
            if (ele.name.toLowerCase().includes(query.toLowerCase())) {
              result.push(ele);
            }
          });
          resolve(result);
        },
        (_, err) => {
          // eslint-disable-next-line no-unused-vars
          console.log("An error occurred while retrieving data from MenuItems table: ", err);
          reject(err);
        }
      );
    });
  }).catch((err) => console.error(`Error filtering menu items: ${err}`));
};

// Define the function to drop the table
export async function dropTable() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Execute the SQL statement to drop the table
      tx.executeSql('drop table if exists menuitems;',
        [],
        (_, result) => {
          resolve(result);
          console.log('Table dropped successfully.');
        },
        // Error handling
        (_, error) => {
          console.log('Error dropping table:', error);
        }
      );
    });
  });
};
