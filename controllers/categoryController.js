const BlogPost = require('../models/BlogPost');
const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
	try {
		const categories = await Category.find();
		  const categoriesWithPostCounts = await Promise.all(
    categories.map(async (cat) => {
      const posts = await BlogPost.countDocuments({ isPublished: true, 	category : cat._id}) 
      return {
        ...cat.toObject(),
        postCount: posts,
      }
    })
  )

		console.log(categoriesWithPostCounts);
		res.json(categoriesWithPostCounts);
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategory = async (req, res) => {
	try {
		const category = await Category.findOne({ slug: req.params.slug });
console.log({category})
		if (!category) {
			return res.status(404).json({ message: 'Category not found' });
		}

		res.json(category);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Create category (Admin only)
// @route   POST /api/categories
// @access  Private (Admin)
const createCategory = async (req, res) => {
	try {
		const category = await Category.create(req.body);
		res.status(201).json(category);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update category (Admin only)
// @route   PUT /api/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res) => {
	try {
		const category = await Category.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);

		if (!category) {
			return res.status(404).json({ message: 'Category not found' });
		}

		res.json(category);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Delete category (Admin only)
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res) => {
	try {
		const category = await Category.findByIdAndDelete(req.params.id);

		if (!category) {
			return res.status(404).json({ message: 'Category not found' });
		}

		res.json({ message: 'Category deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
};
