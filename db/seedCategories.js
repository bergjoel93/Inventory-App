// db/seedCategories.js

const db = require("./db");

const seedCategories = async () => {
  try {
    await db.query(`
            INSERT INTO categories (name, description, imgURL)
            VALUES
                ('Flytrap', 'Carnivorous plants with hinged traps that snap shut when prey touches trigger hairs.', 'https://carnivorousplantnursery.com/cdn/shop/products/VFT_typical_medium_69749e94-bcb2-4c17-8a2a-a2785d87c1e9_352x352.png?v=1677869793'),
                ('Sundew', 'Sticky, tentacle-covered leaves that trap insects and digest them.', 'https://carnivorousplantnursery.com/cdn/shop/files/staghorn.A5a_352x352.png?v=1613161305'),
                ('Sarracenia', 'Pitcher plants that lure insects into deep, tubular leaves.', 'https://carnivorousplantnursery.com/cdn/shop/files/S_purpurea_2_352x352.png?v=1649795400'),
                ('Nepenthes', 'Tropical pitcher plants with large, hanging pitchers that capture insects.', 'https://carnivorousplantnursery.com/cdn/shop/files/n_ampullaria_allgreen_2_352x352.png?v=1724438032'),
                ('Cephalotus', 'The Albany pitcher plant, small and unique to Australia.', 'https://carnivorousplantnursery.com/cdn/shop/products/ceph_medium2_352x352.png?v=1682713305'),
                ('Butterworts', 'Sticky-leaf plants that attract and digest small insects.', 'https://carnivorousplantnursery.com/cdn/shop/products/p.primuliflora.0733aa_352x352.jpg?v=1522002792');
        `);
    console.log("Categories seeded successfully.");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    process.exit();
  }
};

seedCategories();
