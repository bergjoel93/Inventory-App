// db/seedPlants.js
const db = require("./db");

const seedPlants = async () => {
  try {
    await db.query(`
      INSERT INTO plants (categoryId, name, scientificName, quantity, description, imgURL)
      VALUES
        -- Flytrap
        (1, 'Venus Flytrap', 'Dionaea muscipula', 10, 'A popular carnivorous plant that traps insects using jaw-like leaves.', 'https://carnivorousplantnursery.com/cdn/shop/products/VFT_typical_medium_69749e94-bcb2-4c17-8a2a-a2785d87c1e9_352x352.png?v=1677869793'),

        -- Sundew
        (2, 'Cape Sundew', 'Drosera capensis', 15, 'A sundew plant with long, tentacle-covered leaves that curl around insects.', 'https://carnivorousplantnursery.com/cdn/shop/files/staghorn.A5a_352x352.png?v=1613161305'),
        (2, 'Alice Sundew', 'Drosera aliciae', 20, 'Compact rosette sundew with sticky leaves for catching small insects.', 'https://carnivorousplantnursery.com/cdn/shop/products/D.aliciae.png?v=1657862873'),

        -- Sarracenia
        (3, 'Purple Pitcher Plant', 'Sarracenia purpurea', 12, 'A hardy pitcher plant with purple leaves that lure insects into its deep tube.', 'https://carnivorousplantnursery.com/cdn/shop/files/S_purpurea_2_352x352.png?v=1649795400'),
        (3, 'Yellow Pitcher Plant', 'Sarracenia flava', 8, 'Bright yellow pitchers that use nectar to attract and trap insects.', 'https://carnivorousplantnursery.com/cdn/shop/products/Sarracenia_flava.png?v=1677869252'),

        -- Nepenthes
        (4, 'Attenborough''s Pitcher Plant', 'Nepenthes attenboroughii', 5, 'A rare, large pitcher plant with pitchers up to 10 inches in size.', 'https://carnivorousplantnursery.com/cdn/shop/files/n_ampullaria_allgreen_2_352x352.png?v=1724438032'),
        (4, 'Miranda Pitcher Plant', 'Nepenthes miranda', 7, 'A hybrid tropical pitcher plant with large, colorful pitchers.', 'https://carnivorousplantnursery.com/cdn/shop/products/Nepenthes_miranda.png?v=1677869499'),

        -- Cephalotus
        (5, 'Albany Pitcher Plant', 'Cephalotus follicularis', 10, 'An Australian pitcher plant with small, unique, hairy pitchers.', 'https://carnivorousplantnursery.com/cdn/shop/products/ceph_medium2_352x352.png?v=1682713305'),

        -- Butterworts
        (6, 'Primrose Butterwort', 'Pinguicula primuliflora', 18, 'Butterwort with bright green leaves that excrete a sticky substance to trap insects.', 'https://carnivorousplantnursery.com/cdn/shop/products/p.primuliflora.0733aa_352x352.jpg?v=1522002792'),
        (6, 'Mexican Butterwort', 'Pinguicula moranensis', 10, 'A rosette-forming butterwort with pink flowers and sticky leaves.', 'https://carnivorousplantnursery.com/cdn/shop/products/P.moranensis.png?v=1657862913');
    `);

    console.log("Plants seeded successfully.");
  } catch (error) {
    console.error("Error seeding plants:", error);
  } finally {
    process.exit();
  }
};

seedPlants();
