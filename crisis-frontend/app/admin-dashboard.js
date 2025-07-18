// crisis-frontend/app/admin-dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList
} from 'react-native';
import { RadioButton, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { router } from 'expo-router';

// **IMPORTANT: Replace with your backend's IP address and port, or deployed URL.**
const API_BASE_URL = 'http://192.168.1.5:5000/api/help'; // EXAMPLE IP. Update this!

const AdminDashboardScreen = () => {
  const [reporterName, setReporterName] = useState('');
  const [locationDescription, setLocationDescription] = useState(''); // Text description for manual entry
  const [manualLocationCoords, setManualLocationCoords] = useState(null); // { lat, lng } from map picker
  const [numPeople, setNumPeople] = useState('1');
  const [urgencyLevel, setUrgencyLevel] = useState(null); // 'critical', 'urgent', 'request'
  const [requestTypes, setRequestTypes] = useState({
    evacuation: false,
    medical: false,
    foodWater: false,
    shelter: false,
    other: false,
  });
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allRequests, setAllRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(API_BASE_URL);
      setAllRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to fetch requests.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleCheckboxChange = (type) => {
    setRequestTypes(prevState => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };

  const handleSubmit = async () => {
    if (!description || !manualLocationCoords || !urgencyLevel) {
      Alert.alert('Missing Information', 'Please provide a description, location, and urgency level.');
      return;
    }

    setIsLoading(true);
    try {
      const selectedRequestTypes = Object.keys(requestTypes).filter(key => requestTypes[key]);

      const payload = {
        description: notes, // Using notes as main description for manual entry
        location: manualLocationCoords,
        phoneNumber: null, // Not explicitly asked in this form but can be added
        source: 'call', // As this is a manual entry portal
        urgency: urgencyLevel,
        requestTypes: selectedRequestTypes.map(type => { // Map keys to user-friendly strings
            if (type === 'evacuation') return 'Evacuation / Rescue';
            if (type === 'medical') return 'Medical Emergency';
            if (type === 'foodWater') return 'Food & Water';
            if (type === 'shelter') return 'Shelter';
            return 'Other';
        }),
        notes: notes,
        reporterName: reporterName,
        numPeople: parseInt(numPeople)
      };

      const response = await axios.post(API_BASE_URL, payload);
      console.log('Manual entry submitted:', response.data);
      Alert.alert('Success', 'Manual entry submitted successfully!');
      // Clear form
      setReporterName('');
      setLocationDescription('');
      setManualLocationCoords(null);
      setNumPeople('1');
      setUrgencyLevel(null);
      setRequestTypes({
        evacuation: false, medical: false, foodWater: false, shelter: false, other: false,
      });
      setNotes('');
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error('Error submitting manual entry:', error.response ? error.response.data : error.message);
      Alert.alert('Error', `Failed to submit entry: ${error.response?.data?.message || error.message}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/${id}/status`, { status: newStatus });
      Alert.alert('Success', `Request status updated to ${newStatus}`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to update status.');
    }
  };

  // Filter requests for Today's Activity counts
  const todaysRequests = allRequests.filter(req => {
    const today = new Date();
    const reqDate = new Date(req.createdAt);
    return reqDate.getDate() === today.getDate() &&
           reqDate.getMonth() === today.getMonth() &&
           reqDate.getFullYear() === today.getFullYear();
  });

  const criticalCount = todaysRequests.filter(req => req.urgency === 'critical').length;
  const urgentCount = todaysRequests.filter(req => req.urgency === 'urgent').length;
  const requestCount = todaysRequests.filter(req => req.urgency === 'request' || req.urgency === 'low').length; // Assuming 'request' and 'low' fall under 'Requests'
  const totalEntries = todaysRequests.length;

  const renderRecentEntry = ({ item }) => (
    <View style={styles.recentEntryItem}>
      <Text style={styles.recentEntryDescription}>{item.description}</Text>
      <Text style={styles.recentEntryLocation}>Lat: {item.location.lat.toFixed(4)}, Lng: {item.location.lng.toFixed(4)}</Text>
      <Text style={styles.recentEntryStatus}>Status: <Text style={{fontWeight: 'bold', color: item.status === 'rescued' ? 'green' : 'orange'}}>{item.status}</Text></Text>
      <Text style={styles.recentEntryTime}>{new Date(item.createdAt).toLocaleString()}</Text>
      <View style={styles.recentEntryActions}>
        <TouchableOpacity onPress={() => updateRequestStatus(item._id, 'rescued')} style={styles.statusButton}>
          <Text style={styles.statusButtonText}>Mark Rescued</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => updateRequestStatus(item._id, 'pending')} style={styles.statusButton}>
          <Text style={styles.statusButtonText}>Mark Pending</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.portalTitle}>Emergency Response Portal</Text>
        <View style={styles.topBarRight}>
          <Text style={styles.systemStatus}>System Online</Text>
          <Text style={styles.operatorName}>Operator: Sarah Chen</Text>
          <Icon name="notifications" size={24} color="#333" style={styles.topIcon} />
          <Icon name="account-circle" size={24} color="#333" style={styles.topIcon} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchRequests} />
        }
      >
        {/* Left Panel: Manual Entry Portal */}
        <View style={styles.leftPanel}>
          <Text style={styles.sectionTitle}>Manual Entry Portal</Text>
          <Text style={styles.sectionDescription}>Enter details from calls and messages quickly and accurately</Text>

          {/* Reporter Name */}
          <Text style={styles.inputLabel}>Reporter Name (Optional)</Text>
          <TextInput
            style={styles.textInput}
            value={reporterName}
            onChangeText={setReporterName}
            placeholder="Enter reporter's name"
          />

          {/* Location Description (for display only) */}
          <Text style={styles.inputLabel}>Location *</Text>
          <TextInput
            style={styles.textInput}
            value={locationDescription}
            onChangeText={setLocationDescription}
            placeholder="Enter address or location description"
          />
          <TouchableOpacity
            style={styles.pinOnMapButton}
            onPress={() => router.push({
              pathname: "/map-picker",
              params: manualLocationCoords ? { lat: manualLocationCoords.lat, lng: manualLocationCoords.lng } : {}
            })}
          >
            <Icon name="location-on" size={18} color="#fff" />
            <Text style={styles.pinOnMapButtonText}>Pin on Map</Text>
          </TouchableOpacity>
          {manualLocationCoords && (
            <Text style={styles.locationCoordsText}>
              Selected: Lat {manualLocationCoords.lat.toFixed(4)}, Lng {manualLocationCoords.lng.toFixed(4)}
            </Text>
          )}


          {/* Number of People */}
          <Text style={styles.inputLabel}>Number of People *</Text>
          <TextInput
            style={styles.textInput}
            value={numPeople}
            onChangeText={setNumPeople}
            keyboardType="numeric"
          />

          {/* Urgency Level */}
          <Text style={styles.inputLabel}>Urgency Level *</Text>
          <RadioButton.Group onValueChange={newValue => setUrgencyLevel(newValue)} value={urgencyLevel}>
            <View style={[styles.urgencyOption, urgencyLevel === 'critical' && styles.criticalBorder]}>
              <RadioButton value="critical" color="#E91E63" />
              <View>
                <Text style={styles.urgencyTitle}>Critical / SOS</Text>
                <Text style={styles.urgencyDescription}>Life-threatening situation</Text>
              </View>
            </View>
            <View style={[styles.urgencyOption, urgencyLevel === 'urgent' && styles.urgentBorder]}>
              <RadioButton value="urgent" color="#FF9800" />
              <View>
                <Text style={styles.urgencyTitle}>Urgent</Text>
                <Text style={styles.urgencyDescription}>Needs rescue/evacuation, serious injury</Text>
              </View>
            </View>
            <View style={[styles.urgencyOption, urgencyLevel === 'request' && styles.requestBorder]}>
              <RadioButton value="request" color="#FFC107" />
              <View>
                <Text style={styles.urgencyTitle}>Request</Text>
                <Text style={styles.urgencyDescription}>Needs supplies like food, water, first-aid</Text>
              </View>
            </View>
          </RadioButton.Group>

          {/* Request Type */}
          <Text style={styles.inputLabel}>Request Type <Text style={styles.smallText}>(Select all that apply)</Text></Text>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxRow}>
              <Checkbox.Android status={requestTypes.evacuation ? 'checked' : 'unchecked'} onPress={() => handleCheckboxChange('evacuation')} color="#007bff" />
              <Text style={styles.checkboxLabel}>Evacuation / Rescue</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox.Android status={requestTypes.medical ? 'checked' : 'unchecked'} onPress={() => handleCheckboxChange('medical')} color="#007bff" />
              <Text style={styles.checkboxLabel}>Medical Emergency</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox.Android status={requestTypes.foodWater ? 'checked' : 'unchecked'} onPress={() => handleCheckboxChange('foodWater')} color="#007bff" />
              <Text style={styles.checkboxLabel}>Food & Water</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox.Android status={requestTypes.shelter ? 'checked' : 'unchecked'} onPress={() => handleCheckboxChange('shelter')} color="#007bff" />
              <Text style={styles.checkboxLabel}>Shelter</Text>
            </View>
            <View style={styles.checkboxRow}>
              <Checkbox.Android status={requestTypes.other ? 'checked' : 'unchecked'} onPress={() => handleCheckboxChange('other')} color="#007bff" />
              <Text style={styles.checkboxLabel}>Other</Text>
            </View>
          </View>

          {/* Notes */}
          <Text style={styles.inputLabel}>Notes</Text>
          <TextInput
            style={[styles.textInput, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Additional details from the conversation..."
          />
          <Text style={styles.autoSavedText}>Auto-saved</Text>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Icon name="send" size={18} color="#fff" />}
              <Text style={styles.buttonText}>Submit Entry</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveNewButton}>
              <Icon name="save" size={18} color="#007bff" />
              <Text style={styles.saveNewButtonText}>Save & New</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Panel: Today's Activity, Recent Entries, Quick Actions */}
        <View style={styles.rightPanel}>
          <View style={styles.activityBox}>
            <Text style={styles.boxTitle}>Today's Activity</Text>
            <View style={styles.activityRow}>
              <View style={[styles.statusDot, styles.criticalDot]} />
              <Text style={styles.activityText}>Critical</Text>
              <Text style={styles.activityCount}>{criticalCount}</Text>
            </View>
            <View style={styles.activityRow}>
              <View style={[styles.statusDot, styles.urgentDot]} />
              <Text style={styles.activityText}>Urgent</Text>
              <Text style={styles.activityCount}>{urgentCount}</Text>
            </View>
            <View style={styles.activityRow}>
              <View style={[styles.statusDot, styles.requestDot]} />
              <Text style={styles.activityText}>Requests</Text>
              <Text style={styles.activityCount}>{requestCount}</Text>
            </View>
            <View style={styles.totalEntriesRow}>
              <Text style={styles.totalEntriesText}>Total Entries</Text>
              <Text style={styles.totalEntriesCount}>{totalEntries}</Text>
            </View>
          </View>

          <View style={styles.recentEntriesBox}>
            <Text style={styles.boxTitle}>Recent Entries</Text>
            {allRequests.length > 0 ? (
              <FlatList
                data={allRequests.slice(0, 5)} // Show top 5 recent entries
                renderItem={renderRecentEntry}
                keyExtractor={item => item._id}
                scrollEnabled={false} // Disable scrolling within this small list
              />
            ) : (
              <Text style={styles.noRecentText}>No recent entries</Text>
            )}
          </View>

          <View style={styles.quickActionsBox}>
            <Text style={styles.boxTitle}>Quick Actions</Text>
            <TouchableOpacity style={styles.quickActionButton} onPress={() => Alert.alert("Feature", "Live Map not yet integrated")}>
              <Icon name="map" size={20} color="#007bff" />
              <Text style={styles.quickActionButtonText}>View Live Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton} onPress={() => Alert.alert("Feature", "Export Data not yet implemented")}>
              <Icon name="cloud-download" size={20} color="#007bff" />
              <Text style={styles.quickActionButtonText}>Export Today's Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton} onPress={() => Alert.alert("Feature", "System Settings not yet implemented")}>
              <Icon name="settings" size={20} color="#007bff" />
              <Text style={styles.quickActionButtonText}>System Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  portalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  systemStatus: {
    fontSize: 12,
    color: '#28a745',
    marginRight: 10,
  },
  operatorName: {
    fontSize: 14,
    color: '#555',
    marginRight: 15,
  },
  topIcon: {
    marginLeft: 10,
  },
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    padding: 15,
  },
  leftPanel: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginTop: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pinOnMapButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 5,
  },
  pinOnMapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  locationCoordsText: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 10,
    textAlign: 'center',
  },
  urgencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent', // Default no border
  },
  criticalBorder: {
    borderColor: '#E91E63',
  },
  urgentBorder: {
    borderColor: '#FF9800',
  },
  requestBorder: {
    borderColor: '#FFC107',
  },
  urgencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  urgencyDescription: {
    fontSize: 13,
    color: '#777',
  },
  smallText: {
    fontSize: 12,
    color: '#777',
  },
  checkboxContainer: {
    marginTop: 10,
    flexDirection: 'column',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#333',
  },
  autoSavedText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#007bff',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  saveNewButton: {
    backgroundColor: '#e9ecef',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 5,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  saveNewButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Right Panel Styles
  rightPanel: {
    // These will naturally stack below leftPanel due to flex direction
  },
  activityBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recentEntriesBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recentEntryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentEntryDescription: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  recentEntryLocation: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  recentEntryStatus: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  recentEntryTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  recentEntryActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statusButton: {
    backgroundColor: '#e9ecef',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  statusButtonText: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: 'bold',
  },
  quickActionsBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  criticalDot: { backgroundColor: '#E91E63' },
  urgentDot: { backgroundColor: '#FF9800' },
  requestDot: { backgroundColor: '#FFC107' },
  activityText: {
    fontSize: 15,
    color: '#555',
    flex: 1,
  },
  activityCount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  totalEntriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalEntriesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalEntriesCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  noRecentText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    paddingVertical: 30,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quickActionButtonText: {
    fontSize: 16,
    color: '#007bff',
    marginLeft: 10,
  },
});

export default AdminDashboardScreen;