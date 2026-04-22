import { connectDB } from './mongodb'
import Course from '../models/Course'
import Testimonial from '../models/Testimonial'
import { COURSES, TESTIMONIALS } from './data'

async function seed() {
  await connectDB()

  await Course.deleteMany({})
  await Testimonial.deleteMany({})

  await Course.insertMany(COURSES)
  await Testimonial.insertMany(TESTIMONIALS)

  console.log('✅ Database seeded successfully.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
