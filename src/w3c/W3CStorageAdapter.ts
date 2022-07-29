const StorageAdapter = ({ store }) => {

  store.observe(changes => {

    console.log('adapter. changes', changes);
  
  });

}

export default StorageAdapter;