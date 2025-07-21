import { useState, useEffect, useMemo } from 'react';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    imageUrl: '',
    title: '',
    description: '',
    subTitles: [], // Initialize as empty array instead of ['']
    subData: []    // Initialize as empty array instead of ['']
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const db = getFirestore();

  const [formData, setFormData] = useState([]);
  const [checkedRows, setCheckedRows] = useState({});

  // Function to update checkbox state in Firebase
  const updateCheckboxState = async (id, isChecked) => {
    if (!user) return;
    try {
      const docRef = doc(db, "FormData", id);
      await updateDoc(docRef, {
        isChecked: isChecked
      });
    } catch (error) {
      console.error("Error updating checkbox state:", error);
    }
  };

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'FormData'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFormData(data);

        // Initialize checkedRows state from Firebase data
        const initialCheckedState = {};
        data.forEach(item => {
          initialCheckedState[item.id] = item.isChecked || false;
        });
        setCheckedRows(initialCheckedState);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchFormData();
  }, []);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          const querySnapshot = await getDocs(collection(db, "ServiceData"));
          const itemsData = [];
          querySnapshot.forEach((doc) => {
            itemsData.push({ id: doc.id, ...doc.data() });
          });
          setItems(itemsData);
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      } else {
        navigate('/admin');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchItems = async () => {
    if (!user) return;  // This causes the function to return early if user is null

    try {
      const querySnapshot = await getDocs(collection(db, "ServiceData"));
      const itemsData = [];
      querySnapshot.forEach((doc) => {
        itemsData.push({ id: doc.id, ...doc.data() });
      });
      console.log("Fetched items:", itemsData); // Add this line
      setItems(itemsData);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddItem = async () => {
    if (!user) {
      console.error("User not authenticated");
      navigate('/admin');
      return;
    }

    try {
      const userToken = await user.getIdToken();
      console.log("User authenticated with token:", userToken);

      await addDoc(collection(db, "ServiceData"), {
        ...newItem,
        createdBy: user.uid,
        createdAt: new Date().toISOString()
      });

      // In the handleAddItem function, update the setNewItem to initialize with empty arrays
      setNewItem({
        imageUrl: '',
        title: '',
        description: '',
        subTitles: [], // Initialize as empty array
        subData: []    // Initialize as empty array
      });
      fetchItems();
    } catch (error) {
      console.error("Error adding document:", error);
      if (error.code === 'permission-denied') {
        console.error("Permission denied. Please check Firestore rules.");
      }
    }
  };

  const handleDeleteItem = async (id) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "ServiceData", id));
      fetchItems();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const addSubField = (field) => {
    setNewItem(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeSubField = (field, index) => {
    setNewItem(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubFieldChange = (field, index, value) => {
    setNewItem(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const [editingItem, setEditingItem] = useState(null);

  const handleEditItem = async () => {
    if (!user || !editingItem) return;

    try {
      const docRef = doc(db, "ServiceData", editingItem.id);
      await updateDoc(docRef, {
        ...newItem,
        updatedAt: new Date().toISOString()
      });

      setNewItem({
        imageUrl: '',
        title: '',
        description: '',
        subTitles: [],
        subData: []
      });
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const startEditing = (item) => {
    setEditingItem(item);
    setNewItem({
      imageUrl: item.imageUrl || '',
      title: item.title || '',
      description: item.description || '',
      subTitles: item.subTitles || [],
      subData: item.subData || []
    });
  };

  // New state for members
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: '',
    qualification: '',
    experience: '',
    position: '',
    description: '',
    url: '',  // Initialize as empty string for consistent controlled input behavior
    indexNo: 0,
    layout: 'card'
  });
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          // Fetch both service data and member data
          const serviceSnapshot = await getDocs(collection(db, "ServiceData"));
          const memberSnapshot = await getDocs(query(collection(db, "MemberData"), orderBy("indexNo", "asc")));

          const itemsData = [];
          const membersData = [];

          serviceSnapshot.forEach((doc) => {
            itemsData.push({ id: doc.id, ...doc.data() });
          });

          memberSnapshot.forEach((doc) => {
            membersData.push({ id: doc.id, ...doc.data() });
          });

          setItems(itemsData);
          setMembers(membersData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        navigate('/admin');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Function to fetch members
  const fetchMembers = async () => {
    if (!user) return;

    try {
      const q = query(collection(db, "MemberData"), orderBy("indexNo", "asc"));
      const querySnapshot = await getDocs(q);
      const membersData = [];
      querySnapshot.forEach((doc) => {
        membersData.push({ id: doc.id, ...doc.data() });
      });
      setMembers(membersData);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  // Function to add new member
  const handleAddMember = async () => {
    if (!user) {
      console.error("User not authenticated");
      navigate('/admin');
      return;
    }

    try {
      await addDoc(collection(db, "MemberData"), {
        ...newMember,
        createdBy: user.uid,
        createdAt: new Date().toISOString()
      });

      setNewMember({
        name: '',
        qualification: '',
        experience: '',
        position: '',
        description: '',
        url: '',
        indexNo: 0,
        layout: 'card' // Reset with default layout
      });
      fetchMembers();
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  useEffect(() => {
    const fetchCheckboxStatus = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'FormData'));
        const updatedCheckedRows = {};
        querySnapshot.forEach(doc => {
          const data = doc.data();
          updatedCheckedRows[doc.id] = data?.checked || false;
        });
        setCheckedRows(updatedCheckedRows);
      } catch (error) {
        console.error('Error fetching checkbox status:', error);
      }
    };
    fetchCheckboxStatus();
  }, []);

  // Function to delete member
  const handleDeleteMember = async (id) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "MemberData", id));
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  // Function to handle member edit
  const handleEditMember = async () => {
    if (!user || !editingMember) return;

    try {
      const docRef = doc(db, "MemberData", editingMember.id);
      await updateDoc(docRef, {
        ...newMember,
        updatedAt: new Date().toISOString()
      });

      setNewMember({
        name: '',
        qualification: '',
        experience: '',
        position: '',
        description: '',
        url: '',
        indexNo: 0,
        layout: 'card'
      });
      setEditingMember(null);
      fetchMembers();
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  // Function to start editing member
  const startEditingMember = (member) => {
    setEditingMember(member);
    setNewMember({
      name: member.name || '',
      qualification: member.qualification || '',
      experience: member.experience || '',
      position: member.position || '',
      description: member.description || '',
      url: member.url || '',
      indexNo: member.indexNo || 0,
      layout: member.layout || 'card'

    });
  };

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({ name: "", email: "", phone: "", message: "" });
  const [globalSearch, setGlobalSearch] = useState("");

  // Sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getArrow = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  // Filtering
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value.toLowerCase() }));
  };

  // Global + Column Filtering + Sorting
  const filteredData = useMemo(() => {
    return formData
      .filter((item) => {
        const globalMatch =
          globalSearch === "" ||
          Object.values(item).some((val) =>
            val?.toLowerCase?.().includes(globalSearch.toLowerCase())
          );

        const columnMatch = Object.keys(filters).every((key) =>
          item[key]?.toLowerCase?.().includes(filters[key])
        );

        return globalMatch && columnMatch;
      })
      .sort((a, b) => {
        if (!sortConfig.key) return 0;

        const valA = a[sortConfig.key]?.toLowerCase?.() || "";
        const valB = b[sortConfig.key]?.toLowerCase?.() || "";

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [formData, filters, sortConfig, globalSearch]);

  const handleDeleteFormData = async (id) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "FormData", id));
      setFormData(prevData => prevData.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting form data:", error);
    }
  };

  const [inquiries, setInquiries] = useState([]);

  const handleDeleteInquiry = async (id) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "InquiryData", id));
      // Refresh the inquiries list
      const querySnapshot = await getDocs(collection(db, "InquiryData"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInquiries(data);
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const q = query(collection(db, "InquiryData"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          phone: doc.data().phone,
          createdAt: doc.data().createdAt // Add this line
        }));
        setInquiries(data);
      } catch (error) {
        console.error("Error fetching inquiries: ", error);
      }
    };

    fetchInquiries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-[#136DA0]">Admin Dashboard</h1>
          <button
            onClick={() => auth.signOut()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="ri-logout-box-line text-xl"></i>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <i className="ri-service-line text-2xl text-[#136DA0]"></i>
              </div>
              <div>
                <p className="text-gray-500">Total Services</p>
                <p className="text-2xl font-semibold">{items.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <i className="ri-team-line text-2xl text-[#136DA0]"></i>
              </div>
              <div>
                <p className="text-gray-500">Team Members</p>
                <p className="text-2xl font-semibold">{members.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <i className="ri-phone-line text-2xl text-[#136DA0]"></i>
              </div>
              <div>
                <p className="text-gray-500">Inquiries</p>
                <p className="text-2xl font-semibold">{inquiries.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingItem ? 'Edit Service' : 'Add New Service'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* Form fields remain the same, just updated styling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#136DA0] focus:border-transparent transition-all"
                    value={newItem.imageUrl}
                    onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                    placeholder="Enter image URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#136DA0] focus:border-transparent transition-all"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="Enter title"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#136DA0] focus:border-transparent transition-all"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Enter description"
                  rows="4"
                />
              </div>

              {/* Sub Titles and Data */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub Titles</label>
                  <div className="space-y-2">
                    {newItem.subTitles && newItem.subTitles.map((subTitle, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#136DA0] focus:border-transparent transition-all"
                          value={subTitle}
                          onChange={(e) => handleSubFieldChange('subTitles', index, e.target.value)}
                          placeholder={`Sub Title ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeSubField('subTitles', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addSubField('subTitles')}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#136DA0] hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <i className="ri-add-line"></i>
                      Add Sub Title
                    </button>
                  </div>
                </div>

                {/* Sub Data with similar styling */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub Data</label>
                  <div className="space-y-2">
                    {newItem.subData.map((data, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#136DA0] focus:border-transparent transition-all"
                          value={data}
                          onChange={(e) => handleSubFieldChange('subData', index, e.target.value)}
                          placeholder={`Sub Data ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeSubField('subData', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addSubField('subData')}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#136DA0] hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <i className="ri-add-line"></i>
                      Add Sub Data
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={editingItem ? handleEditItem : handleAddItem}
                  className="flex-1 px-6 py-3 bg-[#136DA0] text-white rounded-lg hover:bg-[#0f5a8a] transition-colors font-medium"
                >
                  {editingItem ? 'Update Service' : 'Add Service'}
                </button>
                {editingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setNewItem({
                        imageUrl: '',
                        title: '',
                        description: '',
                        subTitles: [],
                        subData: []
                      });
                    }}
                    className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Display Items in Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
              {item.imageUrl && (
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#136DA0] mb-3 line-clamp-1">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{item.description}</p>

                {Array.isArray(item.subTitles) && item.subTitles.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {item.subTitles.map((subTitle, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-1 flex items-center gap-2">
                          <i className="ri-checkbox-circle-line text-[#136DA0]"></i>
                          {subTitle}
                        </h4>
                        {item.subData[index] && (
                          <p className="text-gray-600 text-sm pl-6">{item.subData[index]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => startEditing(item)}
                    className="flex-1 px-4 py-2.5 text-[#136DA0] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <i className="ri-edit-line"></i>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="flex-1 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <i className="ri-delete-bin-line"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Members Form */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
              <i className="ri-team-line text-[#136DA0]"></i>
              {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-user-line mr-2 text-[#136DA0]"></i>
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#136DA0] focus:border-transparent transition-all"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      placeholder="Enter member's full name"
                    />
                    <i className="ri-user-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* Qualification Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-graduation-cap-line mr-2 text-[#136DA0]"></i>
                    Qualification
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#136DA0] focus:border-transparent transition-all"
                      value={newMember.qualification}
                      onChange={(e) => setNewMember({ ...newMember, qualification: e.target.value })}
                      placeholder="Enter qualification"
                    />
                    <i className="ri-graduation-cap-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* Experience Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-briefcase-line mr-2 text-[#136DA0]"></i>
                    Experience
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#136DA0] focus:border-transparent transition-all"
                      value={newMember.experience}
                      onChange={(e) => setNewMember({ ...newMember, experience: e.target.value })}
                      placeholder="Enter years of experience"
                    />
                    <i className="ri-briefcase-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* Position Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-user-star-line mr-2 text-[#136DA0]"></i>
                    Position
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#136DA0] focus:border-transparent transition-all"
                      value={newMember.position}
                      onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                      placeholder="Enter position (optional)"
                    />
                    <i className="ri-user-star-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* Index Number Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-number-1 mr-2 text-[#136DA0]"></i>
                    Index Number
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#136DA0] focus:border-transparent transition-all"
                      value={newMember.indexNo}
                      onChange={(e) => setNewMember({ ...newMember, indexNo: parseInt(e.target.value) || 0 })}
                      placeholder="Enter index number"
                      min="0"
                    />
                    <i className="ri-number-1 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* Description Field */}
                <div className="relative col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-file-text-line mr-2 text-[#136DA0]"></i>
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#136DA0] focus:border-transparent transition-all"
                      value={newMember.description}
                      onChange={(e) => setNewMember({ ...newMember, description: e.target.value })}
                      placeholder="Enter description (optional)"
                      rows="3"
                    />
                    <i className="ri-file-text-line absolute left-3 top-6 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* URL Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-link mr-2 text-[#136DA0]"></i>
                    Profile URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#136DA0] focus:border-transparent transition-all"
                      value={newMember.url}
                      onChange={(e) => setNewMember({ ...newMember, url: e.target.value })}
                      placeholder="Enter profile URL"
                    />
                    <i className="ri-link absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* Layout Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-layout-line mr-2 text-[#136DA0]"></i>
                    Layout Style
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#136DA0] focus:border-transparent transition-all"
                      value={newMember.layout}
                      onChange={(e) => setNewMember({ ...newMember, layout: e.target.value })}
                    >
                      <option value="card">Card View</option>
                      <option value="big">Big View</option>
                    </select>
                    <i className="ri-layout-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={editingMember ? handleEditMember : handleAddMember}
                  className="flex-1 px-6 py-3 bg-[#136DA0] text-white rounded-lg hover:bg-[#0f5a8a] transition-colors font-medium inline-flex items-center justify-center gap-2"
                >
                  <i className={`ri-${editingMember ? 'save' : 'user-add'}-line`}></i>
                  {editingMember ? 'Update Member' : 'Add Member'}
                </button>
                {editingMember && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMember(null);
                      setNewMember({
                        name: '',
                        qualification: '',
                        experience: '',
                        url: ''
                      });
                    }}
                    className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium inline-flex items-center justify-center gap-2"
                  >
                    <i className="ri-close-line"></i>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Display Members in Cards */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Team Members</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <div key={member.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    {member.url ? (
                      <img
                        src={member.url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/300x200'}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <i className="ri-user-line text-4xl text-gray-400"></i>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{member.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">#{member.indexNo} - {member.qualification}</p>
                    <p className="text-sm text-gray-600 mb-4">{member.experience}</p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEditingMember(member)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Data */}
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-semibold mb-6 text-center">Admin Dashboard</h1>

          {/* Global Search */}


          {/* Table */}
          <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
            <div className="p-4 border-b flex justify-between items-center">
              <input
                type="text"
                placeholder="Global Search..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#136DA0] text-sm mr-4"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
              <button
                onClick={async () => {
                  try {
                    const querySnapshot = await getDocs(collection(db, 'FormData'));
                    const data = querySnapshot.docs.map(doc => ({
                      id: doc.id,
                      ...doc.data()
                    }));
                    setFormData(data);
                  } catch (error) {
                    console.error('Error refreshing form data:', error);
                  }
                }}
                className="px-4 py-2 bg-[#136DA0] text-white rounded-lg hover:bg-[#0f5a8a] transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
            <table className="min-w-full bg-white text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#136DA0] to-[#1E88E5] text-white">
                  {["name", "email", "phone", "message", "city"].map((key) => (
                    <th
                      key={key}
                      className="py-4 px-6 cursor-pointer hover:bg-[#1E88E5] transition-colors"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <span className="text-gray-200">{getArrow(key)}</span>
                      </div>
                    </th>
                  ))}
                  <th className="py-4 px-6">Actions</th>
                </tr>
                <tr className="bg-gray-50">
                  {["name", "email", "phone", "message", "city"].map((key) => (
                    <th key={key} className="p-3">
                      <input
                        type="text"
                        placeholder={`Filter ${key}...`}
                        className="w-full px-3 py-2 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#136DA0] transition-all"
                        value={filters[key]}
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                      />
                    </th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr
                    key={index}
                    className={`transition-colors duration-150 ${checkedRows[item.id] ? 'bg-gray-100 line-through text-gray-500' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checkedRows[item.id] || false}
                          onChange={async () => {
                            const newChecked = !checkedRows[item.id];
                            setCheckedRows(prev => ({
                              ...prev,
                              [item.id]: newChecked
                            }));

                            try {
                              const docRef = doc(db, 'FormData', item.id);
                              await updateDoc(docRef, { checked: newChecked });
                            } catch (error) {
                              console.error('Error updating checkbox status:', error);
                            }
                          }}
                          className="w-4 h-4 text-[#136DA0] border-gray-300 rounded focus:ring-[#136DA0]"
                        />
                        {item.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 hover:text-blue-800">
                      <a href={`mailto:${item.email}`}>{item.email}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 hover:text-blue-800">
                      <a href={`tel:${item.phone}`}>{item.phone}</a>
                    </td>
                    <td className="px-6 py-4">{item.message}</td>
                    <td className="px-6 py-4">{item.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteFormData(item.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-gray-500 bg-gray-50"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>No matching data found</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );


}